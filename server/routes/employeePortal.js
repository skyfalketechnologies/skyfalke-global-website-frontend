const express = require('express');
const slugify = require('slugify');
const router = express.Router();
const {
  systemDashboardAuth,
  isHrManager,
  isSuperAdmin
} = require('../middleware/auth');
const Employee = require('../models/Employee');
const LeaveRequest = require('../models/LeaveRequest');
const PortalAnnouncement = require('../models/PortalAnnouncement');
const WikiArticle = require('../models/WikiArticle');
const PerformanceGoal = require('../models/PerformanceGoal');
const PerformanceReview = require('../models/PerformanceReview');
const PeerFeedback = require('../models/PeerFeedback');
const ITAsset = require('../models/ITAsset');
const SoftwareLicense = require('../models/SoftwareLicense');
const SupportTicket = require('../models/SupportTicket');
const OnboardingTemplate = require('../models/OnboardingTemplate');
const EmployeeOnboarding = require('../models/EmployeeOnboarding');
const IntegrationSettings = require('../models/IntegrationSettings');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const Attendance = require('../models/Attendance');
const { notifyHrNewLeaveRequest } = require('../utils/notifyHrLeave');

router.use(systemDashboardAuth);

async function resolveEmployee(user) {
  if (user.employeeProfile) {
    const e = await Employee.findById(user.employeeProfile).populate(
      'employmentInfo.manager',
      'personalInfo.firstName personalInfo.lastName employeeId employmentInfo.jobTitle employmentInfo.department'
    );
    if (e) return e;
  }
  return Employee.findOne({ 'personalInfo.email': user.email }).populate(
    'employmentInfo.manager',
    'personalInfo.firstName personalInfo.lastName employeeId employmentInfo.jobTitle employmentInfo.department'
  );
}

function canViewSalary(user) {
  return (
    ['super_admin', 'admin', 'hr', 'finance', 'accounts'].includes(user.role) ||
    user.email === 'mronald@skyfalke.com'
  );
}

function canEditWiki(user) {
  return ['super_admin', 'admin', 'editor', 'hr'].includes(user.role) || user.email === 'mronald@skyfalke.com';
}

function canManageIntegrations(user) {
  return user.role === 'super_admin' || user.email === 'mronald@skyfalke.com';
}

async function logPortalAudit(req, action, entityType, entityId, details = {}) {
  try {
    await AuditLog.create({
      userId: req.user._id,
      action,
      entityType,
      entityId,
      details,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  } catch (e) {
    console.error('Portal audit log failed:', e.message);
  }
}

function leaveDaysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e - s;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
router.get('/dashboard', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    const myPendingLeaves = emp
      ? await LeaveRequest.countDocuments({ employee: emp._id, status: 'pending' })
      : 0;
    const openTickets = await SupportTicket.countDocuments({
      createdBy: req.user._id,
      status: { $in: ['open', 'in_progress'] }
    });
    const announcementCount = await PortalAnnouncement.countDocuments({
      published: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }]
    });

    let pendingApprovals = 0;
    if (isHrManager(req.user)) {
      pendingApprovals = await LeaveRequest.countDocuments({ status: 'pending' });
    }

    res.json({
      success: true,
      data: {
        employeeLinked: !!emp,
        myPendingLeaves,
        pendingApprovals: isHrManager(req.user) ? pendingApprovals : undefined,
        openTickets,
        announcements: announcementCount,
        role: req.user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Dashboard failed' });
  }
});

// ---------------------------------------------------------------------------
// Directory & org chart
// ---------------------------------------------------------------------------
router.get('/directory', async (req, res) => {
  try {
    const { search, department, page = 1, limit = 30 } = req.query;
    const query = { 'employmentInfo.status': 'active' };
    if (department) query['employmentInfo.department'] = department;
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    let q = Employee.find(query)
      .populate('employmentInfo.manager', 'personalInfo.firstName personalInfo.lastName employeeId')
      .sort({ 'personalInfo.lastName': 1 })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .lean();

    if (!canViewSalary(req.user)) {
      q = q.select('-employmentInfo.salary');
    }

    const rows = await q;
    const total = await Employee.countDocuments(query);

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Directory failed' });
  }
});

router.get('/org-chart', async (req, res) => {
  try {
    const employees = await Employee.find({ 'employmentInfo.status': 'active' })
      .select(
        canViewSalary(req.user)
          ? 'employeeId personalInfo employmentInfo'
          : 'employeeId personalInfo.firstName personalInfo.lastName personalInfo.email employmentInfo.department employmentInfo.jobTitle employmentInfo.position employmentInfo.manager'
      )
      .populate('employmentInfo.manager', 'employeeId personalInfo.firstName personalInfo.lastName')
      .lean();

    const byId = {};
    employees.forEach((e) => {
      byId[e._id.toString()] = {
        id: e._id,
        employeeId: e.employeeId,
        name: `${e.personalInfo.firstName} ${e.personalInfo.lastName}`,
        department: e.employmentInfo.department,
        jobTitle: e.employmentInfo.jobTitle,
        managerId: e.employmentInfo.manager ? e.employmentInfo.manager._id : null
      };
    });

    res.json({ success: true, data: { nodes: Object.values(byId) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Org chart failed' });
  }
});

// ---------------------------------------------------------------------------
// Leave
// ---------------------------------------------------------------------------
router.get('/leaves', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    const { status } = req.query;
    const query = {};
    if (isHrManager(req.user)) {
      if (status) query.status = status;
    } else {
      if (!emp) {
        return res.json({ success: true, data: [], message: 'Link an employee profile to view leave.' });
      }
      query.employee = emp._id;
    }

    const rows = await LeaveRequest.find(query)
      .populate('employee', 'employeeId personalInfo.firstName personalInfo.lastName employmentInfo.department')
      .populate('requestedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Leave list failed' });
  }
});

router.post('/leaves', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    if (!emp) {
      return res.status(400).json({ success: false, message: 'No employee profile linked to your account.' });
    }

    const { leaveType, startDate, endDate, reason, days } = req.body;
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    const d = days || leaveDaysBetween(sd, ed);

    const lr = new LeaveRequest({
      employee: emp._id,
      requestedBy: req.user._id,
      leaveType,
      startDate: sd,
      endDate: ed,
      days: d,
      reason: reason || ''
    });
    await lr.save();
    await logPortalAudit(req, 'leave.create', 'LeaveRequest', lr._id, { leaveType });
    await notifyHrNewLeaveRequest(lr, req.user);

    res.status(201).json({ success: true, data: lr });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Leave create failed' });
  }
});

router.post('/leaves/:id/approve', async (req, res) => {
  try {
    if (!isHrManager(req.user)) {
      return res.status(403).json({ success: false, message: 'HR or Admin only' });
    }
    const lr = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNote: req.body.reviewNote || ''
      },
      { new: true }
    ).populate('employee');

    if (!lr) return res.status(404).json({ success: false, message: 'Not found' });

    const emp = await Employee.findById(lr.employee);
    if (emp && emp.leaveBalances && lr.leaveType === 'annual') {
      const y = new Date(lr.startDate).getFullYear();
      let row = emp.leaveBalances.find((b) => b.year === y);
      if (!row) {
        emp.leaveBalances.push({ year: y, annual: { allocated: 21, used: 0 }, sick: {}, personal: {} });
        row = emp.leaveBalances[emp.leaveBalances.length - 1];
      }
      row.annual.used = (row.annual.used || 0) + lr.days;
      await emp.save();
    }

    const user = await require('../models/User').findOne({ employeeProfile: lr.employee });
    if (user) {
      try {
        await Notification.create({
          title: 'Leave approved',
          message: `Your leave request was approved (${lr.leaveType})`,
          type: 'success',
          category: 'portal',
          recipient: user._id,
          actionUrl: '/system/dashboard/portal/leave'
        });
      } catch (_) {}
    }

    await logPortalAudit(req, 'leave.approve', 'LeaveRequest', lr._id, {});
    res.json({ success: true, data: lr });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/leaves/:id/reject', async (req, res) => {
  try {
    if (!isHrManager(req.user)) {
      return res.status(403).json({ success: false, message: 'HR or Admin only' });
    }
    const lr = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNote: req.body.reviewNote || ''
      },
      { new: true }
    );
    if (!lr) return res.status(404).json({ success: false, message: 'Not found' });
    await logPortalAudit(req, 'leave.reject', 'LeaveRequest', lr._id, {});
    res.json({ success: true, data: lr });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------
router.get('/announcements', async (req, res) => {
  try {
    const rows = await PortalAnnouncement.find({
      published: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }]
    })
      .populate('author', 'name email')
      .sort({ pinned: -1, createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Announcements failed' });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    if (!isHrManager(req.user)) {
      return res.status(403).json({ success: false, message: 'HR or Admin only' });
    }
    const a = new PortalAnnouncement({
      ...req.body,
      author: req.user._id
    });
    await a.save();
    await logPortalAudit(req, 'announcement.create', 'PortalAnnouncement', a._id, {});
    res.status(201).json({ success: true, data: a });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// Wiki
// ---------------------------------------------------------------------------
router.get('/wiki/articles', async (req, res) => {
  try {
    const { search, category, status = 'published' } = req.query;
    const q = {};
    if (status) q.status = status;
    if (category) q.category = category;
    if (search && String(search).trim()) {
      const s = String(search).trim();
      q.$or = [
        { title: { $regex: s, $options: 'i' } },
        { content: { $regex: s, $options: 'i' } },
        { tags: { $regex: s, $options: 'i' } }
      ];
    }

    const rows = await WikiArticle.find(q)
      .populate('author', 'name email')
      .sort({ updatedAt: -1 })
      .limit(100);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Wiki list failed' });
  }
});

router.get('/wiki/articles/:slug', async (req, res) => {
  try {
    const article = await WikiArticle.findOne({ slug: req.params.slug }).populate('author', 'name email');
    if (!article) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Wiki get failed' });
  }
});

router.post('/wiki/articles', async (req, res) => {
  try {
    if (!canEditWiki(req.user)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    const { title, content, category, tags, status } = req.body;
    const base = slugify(title, { lower: true, strict: true });
    let slug = base;
    let n = 0;
    while (await WikiArticle.findOne({ slug })) {
      n += 1;
      slug = `${base}-${n}`;
    }

    const article = new WikiArticle({
      title,
      slug,
      category: category || 'General',
      tags: tags || [],
      content: content || '',
      status: status || 'draft',
      author: req.user._id,
      versions: [{ version: 1, title, content, editedBy: req.user._id, editedAt: new Date() }]
    });
    await article.save();
    await logPortalAudit(req, 'wiki.create', 'WikiArticle', article._id, { slug });
    res.status(201).json({ success: true, data: article });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/wiki/articles/:id', async (req, res) => {
  try {
    if (!canEditWiki(req.user)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    const article = await WikiArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Not found' });

    const { title, content, category, tags, status } = req.body;
    if (title) article.title = title;
    if (content !== undefined) article.content = content;
    if (category) article.category = category;
    if (tags) article.tags = tags;
    if (status) article.status = status;

    article.currentVersion = (article.currentVersion || 1) + 1;
    article.versions.push({
      version: article.currentVersion,
      title: article.title,
      content: article.content,
      editedBy: req.user._id,
      editedAt: new Date()
    });
    await article.save();
    await logPortalAudit(req, 'wiki.update', 'WikiArticle', article._id, { version: article.currentVersion });
    res.json({ success: true, data: article });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------
router.get('/performance/goals', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    const { employeeId, year } = req.query;
    const q = {};
    if (isHrManager(req.user) && employeeId) {
      q.employee = employeeId;
    } else if (emp) {
      q.employee = emp._id;
    } else {
      return res.json({ success: true, data: [] });
    }
    if (year) q.year = parseInt(year, 10);

    const rows = await PerformanceGoal.find(q).sort({ year: -1 }).limit(100);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Goals failed' });
  }
});

router.post('/performance/goals', async (req, res) => {
  try {
    if (!isHrManager(req.user) && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Managers/HR only' });
    }
    const g = new PerformanceGoal({
      ...req.body,
      createdBy: req.user._id
    });
    await g.save();
    res.status(201).json({ success: true, data: g });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/performance/reviews', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    const q = {};
    if (isHrManager(req.user) && req.query.employeeId) {
      q.employee = req.query.employeeId;
    } else if (emp) {
      q.employee = emp._id;
    } else {
      return res.json({ success: true, data: [] });
    }

    const rows = await PerformanceReview.find(q)
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Reviews failed' });
  }
});

router.post('/performance/reviews', async (req, res) => {
  try {
    if (!isHrManager(req.user) && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'HR/Admin only' });
    }
    const r = new PerformanceReview({
      ...req.body,
      reviewer: req.user._id
    });
    await r.save();
    res.status(201).json({ success: true, data: r });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/feedback', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    if (!emp) return res.json({ success: true, data: [] });
    const rows = await PeerFeedback.find({ toEmployee: emp._id })
      .populate('fromUser', 'name email')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const masked = rows.map((f) => {
      if (f.anonymous) {
        return { ...f, fromUser: null };
      }
      return f;
    });

    res.json({ success: true, data: masked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Feedback failed' });
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const { toEmployee, body, anonymous, category } = req.body;
    if (!toEmployee || !body) {
      return res.status(400).json({ success: false, message: 'toEmployee and body required' });
    }
    const f = new PeerFeedback({
      fromUser: req.user._id,
      toEmployee,
      body,
      anonymous: !!anonymous,
      category: category || 'peer'
    });
    await f.save();
    res.status(201).json({ success: true, data: f });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// IT & assets
// ---------------------------------------------------------------------------
router.get('/it/assets', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    const q = {};
    if (!isHrManager(req.user) && emp) {
      q.assignedEmployee = emp._id;
    }
    const rows = await ITAsset.find(q).sort({ updatedAt: -1 }).limit(200);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Assets failed' });
  }
});

router.post('/it/assets', async (req, res) => {
  try {
    if (!isHrManager(req.user) && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'IT/HR only' });
    }
    const a = new ITAsset({ ...req.body, createdBy: req.user._id });
    await a.save();
    res.status(201).json({ success: true, data: a });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/it/licenses', async (req, res) => {
  try {
    const rows = await SoftwareLicense.find().sort({ name: 1 }).limit(200);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Licenses failed' });
  }
});

router.post('/it/licenses', async (req, res) => {
  try {
    if (!isHrManager(req.user) && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'HR/Admin only' });
    }
    const lic = new SoftwareLicense(req.body);
    await lic.save();
    res.status(201).json({ success: true, data: lic });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/it/tickets', async (req, res) => {
  try {
    const q = isHrManager(req.user) || req.user.role === 'super_admin' ? {} : { createdBy: req.user._id };
    const rows = await SupportTicket.find(q)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Tickets failed' });
  }
});

router.post('/it/tickets', async (req, res) => {
  try {
    const t = new SupportTicket({ ...req.body, createdBy: req.user._id });
    await t.save();
    res.status(201).json({ success: true, data: t });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch('/it/tickets/:id', async (req, res) => {
  try {
    if (!isHrManager(req.user) && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'HR/Admin only' });
    }
    const t = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: t });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------
router.get('/onboarding/templates', async (req, res) => {
  try {
    if (!isHrManager(req.user)) {
      return res.status(403).json({ success: false, message: 'HR only' });
    }
    const rows = await OnboardingTemplate.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Templates failed' });
  }
});

router.post('/onboarding/templates', async (req, res) => {
  try {
    if (!isHrManager(req.user)) {
      return res.status(403).json({ success: false, message: 'HR only' });
    }
    const t = new OnboardingTemplate({ ...req.body, createdBy: req.user._id });
    await t.save();
    res.status(201).json({ success: true, data: t });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/onboarding/me', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    if (!emp) return res.json({ success: true, data: null });
    const ob = await EmployeeOnboarding.findOne({ employee: emp._id }).populate('template');
    res.json({ success: true, data: ob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Onboarding failed' });
  }
});

router.post('/onboarding/start', async (req, res) => {
  try {
    if (!isHrManager(req.user)) {
      return res.status(403).json({ success: false, message: 'HR only' });
    }
    const { employeeId, templateId } = req.body;
    const template = await OnboardingTemplate.findById(templateId);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

    const items = template.items.map((i) => ({
      title: i.title,
      description: i.description,
      order: i.order,
      done: false
    }));

    const ob = await EmployeeOnboarding.findOneAndUpdate(
      { employee: employeeId },
      {
        employee: employeeId,
        template: templateId,
        items
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: ob });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch('/onboarding/me/items/:index', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    if (!emp) return res.status(400).json({ success: false, message: 'No employee profile' });

    const ob = await EmployeeOnboarding.findOne({ employee: emp._id });
    if (!ob) return res.status(404).json({ success: false, message: 'No onboarding' });

    const idx = parseInt(req.params.index, 10);
    if (!ob.items[idx]) return res.status(404).json({ success: false, message: 'Invalid item' });

    ob.items[idx].done = !!req.body.done;
    ob.items[idx].doneAt = req.body.done ? new Date() : null;
    ob.items[idx].doneBy = req.body.done ? req.user._id : null;
    await ob.save();
    res.json({ success: true, data: ob });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// Attendance (employee self-service view)
// ---------------------------------------------------------------------------
router.get('/attendance/me', async (req, res) => {
  try {
    const emp = await resolveEmployee(req.user);
    if (!emp) return res.json({ success: true, data: [] });

    const rows = await Attendance.find({ employee: emp._id })
      .sort({ date: -1 })
      .limit(90)
      .lean();

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Attendance failed' });
  }
});

// ---------------------------------------------------------------------------
// Integrations (admin)
// ---------------------------------------------------------------------------
router.get('/integrations', async (req, res) => {
  try {
    if (!canManageIntegrations(req.user)) {
      return res.status(403).json({ success: false, message: 'Super Admin only' });
    }
    let doc = await IntegrationSettings.findOne({ key: 'global' });
    if (!doc) {
      doc = await IntegrationSettings.create({ key: 'global' });
    }
    res.json({
      success: true,
      data: doc,
      hints: {
        slack: 'Set Incoming Webhook URL; optional Slack integration for announcements.',
        jira: 'Base URL and project key for developer workflow links.',
        github: 'Organization for linking repositories.',
        googleWorkspace: 'Primary Google Workspace domain for SSO/docs (future).'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Integrations read failed' });
  }
});

router.put('/integrations', async (req, res) => {
  try {
    if (!canManageIntegrations(req.user)) {
      return res.status(403).json({ success: false, message: 'Super Admin only' });
    }
    const doc = await IntegrationSettings.findOneAndUpdate(
      { key: 'global' },
      { ...req.body, updatedBy: req.user._id },
      { new: true, upsert: true }
    );
    await logPortalAudit(req, 'integrations.update', 'IntegrationSettings', doc._id, {});
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// Audit log (super admin)
// ---------------------------------------------------------------------------
router.get('/audit-logs', async (req, res) => {
  try {
    if (!isSuperAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'Super Admin only' });
    }
    const { page = 1, limit = 40 } = req.query;
    const list = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .populate('userId', 'name email');

    res.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Audit log failed' });
  }
});

module.exports = router;
