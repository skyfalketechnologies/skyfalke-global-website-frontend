const User = require('../models/User');
const Employee = require('../models/Employee');

/**
 * Keeps `User.employeeProfile` and `Employee.user` in sync (one login ↔ one HR record).
 * @param {import('mongoose').Types.ObjectId|string} employeeId
 * @param {import('mongoose').Types.ObjectId|string|null|undefined} newUserId - omit on update to leave link unchanged
 */
async function syncEmployeeUserLink(employeeId, newUserId) {
  if (newUserId === undefined) {
    return;
  }

  if (!newUserId) {
    await User.updateMany({ employeeProfile: employeeId }, { $unset: { employeeProfile: 1 } });
    await Employee.findByIdAndUpdate(employeeId, { $unset: { user: 1 } });
    return;
  }

  await User.findByIdAndUpdate(newUserId, { $unset: { employeeProfile: 1 } });
  await Employee.updateMany(
    { user: newUserId, _id: { $ne: employeeId } },
    { $unset: { user: 1 } }
  );
  await User.findByIdAndUpdate(newUserId, { employeeProfile: employeeId });
  await Employee.findByIdAndUpdate(employeeId, { user: newUserId });
}

module.exports = { syncEmployeeUserLink };
