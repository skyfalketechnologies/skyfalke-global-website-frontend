import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AnalyticsProvider from './components/Analytics/AnalyticsProvider';
import CookieBanner from './components/CookieBanner';
import useScrollToTop from './hooks/useScrollToTop';
import ScrollToTop from './components/ScrollToTop';
import GlobalMetaManager from './components/SEO/GlobalMetaManager';
import FontLoader from './components/FontLoader';
import PerformanceMonitor from './components/PerformanceMonitor';
import CriticalCSS from './components/CriticalCSS';
import LoadingSpinner from './components/LoadingSpinner';
import ChristmasDecorations from './components/Christmas/ChristmasDecorations';

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Critical Pages (load immediately)
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Resources from './pages/Resources';

// Solution Pages
import DataAnalytics from './pages/DataAnalytics';
import EarnedMedia from './pages/EarnedMedia';
import PaidMedia from './pages/PaidMedia';
import Creative from './pages/Creative';
import BusinessTools from './pages/BusinessTools';
import CloudSolutions from './pages/CloudSolutions';

// Data Analytics Sub-Solution Pages
import BusinessIntelligence from './pages/DataAnalytics/BusinessIntelligence';
import DataAnalyticsPage from './pages/DataAnalytics/DataAnalytics';
import PredictiveAnalytics from './pages/DataAnalytics/PredictiveAnalytics';
import PerformanceTracking from './pages/DataAnalytics/PerformanceTracking';
import CustomDashboards from './pages/DataAnalytics/CustomDashboards';

// Earned Media Sub-Solution Pages
import PublicRelations from './pages/EarnedMedia/PublicRelations';
import InfluencerMarketing from './pages/EarnedMedia/InfluencerMarketing';
import ContentMarketing from './pages/EarnedMedia/ContentMarketing';
import SocialMediaManagement from './pages/EarnedMedia/SocialMediaManagement';
import BrandAwareness from './pages/EarnedMedia/BrandAwareness';

// Paid Media Sub-Solution Pages
import GoogleAds from './pages/PaidMedia/GoogleAds';
import SocialMediaAds from './pages/PaidMedia/SocialMediaAds';
import DisplayAdvertising from './pages/PaidMedia/DisplayAdvertising';
import VideoAdvertising from './pages/PaidMedia/VideoAdvertising';
import RetargetingCampaigns from './pages/PaidMedia/RetargetingCampaigns';

// Creative Sub-Solution Pages
import BrandDesign from './pages/Creative/BrandDesign';
import UIUXDesign from './pages/Creative/UIUXDesign';
import GraphicDesign from './pages/Creative/GraphicDesign';
import VideoProduction from './pages/Creative/VideoProduction';
import ContentCreation from './pages/Creative/ContentCreation';

// Business Tools Sub-Solution Pages
import SEOToolsAnalytics from './pages/BusinessTools/SEOToolsAnalytics';
import ProcessAutomation from './pages/BusinessTools/ProcessAutomation';
import CustomApplications from './pages/BusinessTools/CustomApplications';
import BusinessIntelligenceTools from './pages/BusinessTools/BusinessIntelligence';
import PerformanceOptimization from './pages/BusinessTools/PerformanceOptimization';

// ICT Strategy Page
import ICTStrategy from './pages/ICTStrategy';

// Consultation Page
import ScheduleConsultation from './pages/ScheduleConsultation';

// Admin Pages
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminBlogs from './pages/Admin/Blogs';
import BlogFormPage from './pages/Admin/BlogFormPage';
import AdminContent from './pages/Admin/Content';
import AdminContacts from './pages/Admin/Contacts';
import ContactDetail from './pages/Admin/ContactDetail';
import Leads from './pages/Admin/Leads';
import LeadDetail from './pages/Admin/LeadDetail';
import LeadForm from './pages/Admin/LeadForm';
import Tenders from './pages/Admin/Tenders';
import TenderDetail from './pages/Admin/TenderDetail';
import TenderForm from './pages/Admin/TenderForm';
import AdminSubscriptions from './pages/Admin/Subscriptions';
import EmailCampaigns from './pages/Admin/EmailCampaigns';
import CampaignForm from './pages/Admin/CampaignForm';
import CampaignDetail from './pages/Admin/CampaignDetail';
import WhatsApp from './pages/Admin/WhatsApp';
import CareersDashboard from './pages/Admin/CareersDashboard';
import JobForm from './components/Admin/JobForm';
import AdminAnalytics from './pages/Admin/Analytics';
import AdminJobs from './pages/Admin/Jobs';
import AdminApplications from './pages/Admin/Applications';
import ApplicationDetail from './pages/Admin/ApplicationDetail';
import AdminPartnerships from './pages/Admin/Partnerships';
import AdminEvents from './pages/Admin/Events';
import ShopDashboard from './pages/Admin/ShopDashboard';
import ProductForm from './pages/Admin/ProductForm';
import Products from './pages/Admin/Products';
import Orders from './pages/Admin/Orders';
import OrderDetail from './pages/Admin/OrderDetail';
import AdminCaseStudies from './pages/Admin/CaseStudies';
import CaseStudyForm from './components/Admin/CaseStudyForm';
import SitemapManager from './pages/Admin/SitemapManager';
import InvoiceList from './pages/Admin/InvoiceList';
import InvoiceMaker from './pages/Admin/InvoiceMaker';
import QuotationsPage from './pages/QuotationsPage';
import AcademyDashboard from './pages/Admin/AcademyDashboard';
import AcademyCourses from './pages/Admin/AcademyCourses';
import AcademyTrainers from './pages/Admin/AcademyTrainers';
import AcademyStudents from './pages/Admin/AcademyStudents';
import AcademyEnrollments from './pages/Admin/AcademyEnrollments';
import AcademyAnalytics from './pages/Admin/AcademyAnalytics';
import CourseForm from './components/Admin/CourseForm';
import TrainerForm from './components/Admin/TrainerForm';
import HRDashboard from './pages/Admin/HRDashboard';
import Employees from './pages/Admin/Employees';
import EmployeeForm from './pages/Admin/EmployeeForm';
import Payrolls from './pages/Admin/Payrolls';
import PayrollForm from './pages/Admin/PayrollForm';
import Attendance from './pages/Admin/Attendance';
import AccountingDashboard from './pages/Admin/AccountingDashboard';
import Expenses from './pages/Admin/Expenses';
import ExpenseForm from './pages/Admin/ExpenseForm';
import Accounts from './pages/Admin/Accounts';
import AccountForm from './pages/Admin/AccountForm';
import Transactions from './pages/Admin/Transactions';
import TransactionForm from './pages/Admin/TransactionForm';
import Reports from './pages/Admin/Reports';
import Projects from './pages/Admin/Projects';
import ProjectForm from './pages/Admin/ProjectForm';
import ProjectDetail from './pages/Admin/ProjectDetail';
import StaffManagement from './pages/Admin/StaffManagement';
import Profile from './pages/Admin/Profile';
import Settings from './pages/Admin/Settings';
import Login from './pages/Admin/Login';
import SecureLogin from './pages/Admin/SecureLogin';
import HiddenLogin from './pages/Admin/HiddenLogin';
import AccessDenied from './pages/Admin/AccessDenied';
import Fake404 from './pages/Admin/Fake404';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load non-critical pages for better performance
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Careers = lazy(() => import('./pages/Careers'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const JobApplication = lazy(() => import('./pages/JobApplication'));
const ApplicationSuccess = lazy(() => import('./pages/ApplicationSuccess'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const CheckoutCancel = lazy(() => import('./pages/CheckoutCancel'));
const Support = lazy(() => import('./pages/Support'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cloud = lazy(() => import('./pages/Cloud'));
const Partners = lazy(() => import('./pages/Partners'));
const Events = lazy(() => import('./pages/Events'));
const Academy = lazy(() => import('./pages/Academy'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));

function App() {
  useEffect(() => {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    // Track page views for analytics
    const trackPageView = () => {
      if (window.location.pathname !== '/admin' && !window.location.pathname.startsWith('/admin/')) {
        // Track analytics (implement API call)
        // Page view tracked
      }
    };

    trackPageView();
  }, []);

  return (
    <ErrorBoundary>
      <AnalyticsProvider>
        <CartProvider>
          <NotificationProvider>
            <div className="App min-h-screen bg-gray-50">
              <CriticalCSS />
              <FontLoader />
              <PerformanceMonitor />
              <ScrollToTop />
              <ChristmasDecorations />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <main>
                <Home />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/about" element={
            <>
              <Header />
              <main>
                <About />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/services" element={
            <>
              <Header />
              <main>
                <Services />
              </main>
              <Footer />
            </>
          } />

          <Route path="/cloud" element={
            <>
              <Header />
              <main>
                <Cloud />
              </main>
              <Footer />
            </>
          } />

          <Route path="/cloud-solutions" element={
            <>
              <Header />
              <main>
                <CloudSolutions />
              </main>
              <Footer />
            </>
          } />

          {/* Solution Pages */}
          <Route path="/services/data-analytics" element={
            <>
              <Header />
              <main>
                <DataAnalytics />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/earned-media" element={
            <>
              <Header />
              <main>
                <EarnedMedia />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/paid-media" element={
            <>
              <Header />
              <main>
                <PaidMedia />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/creative" element={
            <>
              <Header />
              <main>
                <Creative />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/business-tools" element={
            <>
              <Header />
              <main>
                <BusinessTools />
              </main>
              <Footer />
            </>
          } />

          {/* Data Analytics Sub-Solution Pages */}
          <Route path="/services/data-analytics/business-intelligence" element={
            <>
              <Header />
              <main>
                <BusinessIntelligence />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/data-analytics/data-analytics" element={
            <>
              <Header />
              <main>
                <DataAnalyticsPage />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/data-analytics/predictive-analytics" element={
            <>
              <Header />
              <main>
                <PredictiveAnalytics />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/data-analytics/performance-tracking" element={
            <>
              <Header />
              <main>
                <PerformanceTracking />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/data-analytics/custom-dashboards" element={
            <>
              <Header />
              <main>
                <CustomDashboards />
              </main>
              <Footer />
            </>
          } />

          {/* Earned Media Sub-Solution Pages */}
          <Route path="/services/earned-media/public-relations" element={
            <>
              <Header />
              <main>
                <PublicRelations />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/earned-media/influencer-marketing" element={
            <>
              <Header />
              <main>
                <InfluencerMarketing />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/earned-media/content-marketing" element={
            <>
              <Header />
              <main>
                <ContentMarketing />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/earned-media/social-media-management" element={
            <>
              <Header />
              <main>
                <SocialMediaManagement />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/earned-media/brand-awareness" element={
            <>
              <Header />
              <main>
                <BrandAwareness />
              </main>
              <Footer />
            </>
          } />

          {/* Paid Media Sub-Solution Pages */}
          <Route path="/services/paid-media/google-ads" element={
            <>
              <Header />
              <main>
                <GoogleAds />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/paid-media/social-media-ads" element={
            <>
              <Header />
              <main>
                <SocialMediaAds />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/paid-media/display-advertising" element={
            <>
              <Header />
              <main>
                <DisplayAdvertising />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/paid-media/video-advertising" element={
            <>
              <Header />
              <main>
                <VideoAdvertising />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/paid-media/retargeting-campaigns" element={
            <>
              <Header />
              <main>
                <RetargetingCampaigns />
              </main>
              <Footer />
            </>
          } />

          {/* Creative Sub-Solution Pages */}
          <Route path="/services/creative/brand-design" element={
            <>
              <Header />
              <main>
                <BrandDesign />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/creative/ui-ux-design" element={
            <>
              <Header />
              <main>
                <UIUXDesign />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/creative/graphic-design" element={
            <>
              <Header />
              <main>
                <GraphicDesign />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/creative/video-production" element={
            <>
              <Header />
              <main>
                <VideoProduction />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/creative/content-creation" element={
            <>
              <Header />
              <main>
                <ContentCreation />
              </main>
              <Footer />
            </>
          } />

          {/* Business Tools Sub-Solution Pages */}
          <Route path="/services/business-tools/seo-tools-analytics" element={
            <>
              <Header />
              <main>
                <SEOToolsAnalytics />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/business-tools/process-automation" element={
            <>
              <Header />
              <main>
                <ProcessAutomation />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/business-tools/custom-applications" element={
            <>
              <Header />
              <main>
                <CustomApplications />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/business-tools/business-intelligence" element={
            <>
              <Header />
              <main>
                <BusinessIntelligenceTools />
              </main>
              <Footer />
            </>
          } />

          <Route path="/services/business-tools/performance-optimization" element={
            <>
              <Header />
              <main>
                <PerformanceOptimization />
              </main>
              <Footer />
            </>
          } />

          {/* ICT Strategy Page */}
          <Route path="/services/ict-strategy" element={
            <>
              <Header />
              <main>
                <ICTStrategy />
              </main>
              <Footer />
            </>
          } />

          {/* Consultation Page */}
          <Route path="/schedule-consultation" element={
            <>
              <Header />
              <main>
                <ScheduleConsultation />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/case-studies" element={
            <>
              <Header />
              <main>
                <CaseStudies />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/blog" element={
            <>
              <Header />
              <main>
                <Blog />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/blog/:slug" element={
            <>
              <Header />
              <main>
                <BlogPost />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/contact" element={
            <>
              <Header />
              <main>
                <Contact />
              </main>
              <Footer />
            </>
          } />

          <Route path="/resources" element={
            <>
              <Header />
              <main>
                <Resources />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/partners" element={
            <>
              <Header />
              <main>
                <Partners />
              </main>
              <Footer />
            </>
          } />

          <Route path="/events" element={ // Added
            <>
              <Header />
              <main>
                <Events />
              </main>
              <Footer />
            </>
          } />

          <Route path="/academy" element={
            <>
              <Header />
              <main>
                <Academy />
              </main>
              <Footer />
            </>
          } />

          <Route path="/academy/courses" element={
            <>
              <Header />
              <main>
                <Courses />
              </main>
              <Footer />
            </>
          } />

          <Route path="/academy/courses/:slug" element={
            <>
              <Header />
              <main>
                <CourseDetail />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/careers" element={
            <>
              <Header />
              <main>
                <Careers />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/careers/:id" element={
            <>
              <Header />
              <main>
                <JobDetail />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/careers/:id/apply" element={
            <>
              <Header />
              <main>
                <JobApplication />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/careers/:id/application-success" element={
            <>
              <Header />
              <main>
                <ApplicationSuccess />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/shop" element={
            <>
              <Header />
              <main>
                <Shop />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/shop/product/:slug" element={
            <>
              <Header />
              <main>
                <ProductDetail />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/checkout" element={
            <>
              <Header />
              <main>
                <Checkout />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/checkout/success" element={
            <>
              <Header />
              <main>
                <CheckoutSuccess />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/checkout/cancel" element={
            <>
              <Header />
              <main>
                <CheckoutCancel />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/case-studies" element={
            <>
              <Header />
              <main>
                <CaseStudies />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/case-studies/:slug" element={
            <>
              <Header />
              <main>
                <CaseStudyDetail />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/support" element={
            <>
              <Header />
              <main>
                <Support />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/privacy" element={
            <>
              <Header />
              <main>
                <Privacy />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/terms" element={
            <>
              <Header />
              <main>
                <Terms />
              </main>
              <Footer />
            </>
          } />

          {/* Admin Login Routes */}
          <Route path="/admin/secure" element={<SecureLogin />} />
          
          {/* Hidden Admin Access - Non-obvious URL */}
          <Route path="/system/portal/access" element={<HiddenLogin />} />
          
          {/* Fake 404 for obvious admin URLs */}
          <Route path="/admin" element={<Fake404 />} />
          <Route path="/dashboard" element={<Fake404 />} />
          <Route path="/portal" element={<Fake404 />} />
          <Route path="/login" element={<Fake404 />} />
          <Route path="/admin-panel" element={<Fake404 />} />
          <Route path="/administrator" element={<Fake404 />} />

          {/* Protected Admin Routes */}
          <Route path="/system/dashboard" element={
            <ProtectedRoute adminOnly={true} requireSecureLogin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blogs/new" element={<BlogFormPage />} />
            <Route path="blogs/:id/edit" element={<BlogFormPage />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="contacts/:id" element={<ContactDetail />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leads/new" element={<LeadForm />} />
            <Route path="leads/:id" element={<LeadDetail />} />
            <Route path="leads/:id/edit" element={<LeadForm />} />
            <Route path="tenders" element={<Tenders />} />
            <Route path="tenders/new" element={<TenderForm />} />
            <Route path="tenders/:id" element={<TenderDetail />} />
            <Route path="tenders/:id/edit" element={<TenderForm />} />
            <Route path="whatsapp" element={<WhatsApp />} />
            <Route path="campaigns" element={<EmailCampaigns />} />
            <Route path="campaigns/new" element={<CampaignForm />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="campaigns/:id/edit" element={<CampaignForm />} />
            <Route path="partnerships" element={<AdminPartnerships />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="careers" element={<CareersDashboard />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="jobs/new" element={<JobForm />} />
            <Route path="jobs/:id/edit" element={<JobForm />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="applications/:id" element={<ApplicationDetail />} />
            <Route path="shop" element={<ShopDashboard />} />
            <Route path="shop/products" element={<Products />} />
            <Route path="shop/products/new" element={<ProductForm />} />
            <Route path="shop/products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
            <Route path="case-studies/new" element={<CaseStudyForm />} />
            <Route path="case-studies/edit/:id" element={<CaseStudyForm />} />
            <Route path="sitemap" element={<SitemapManager />} />
            <Route path="invoices" element={<InvoiceList />} />
            <Route path="invoices/new" element={<InvoiceMaker />} />
            <Route path="invoices/:id/edit" element={<InvoiceMaker />} />
            <Route path="quotations/*" element={<QuotationsPage />} />
            <Route path="academy" element={<AcademyDashboard />} />
            <Route path="academy/courses" element={<AcademyCourses />} />
            <Route path="academy/courses/new" element={<CourseForm />} />
            <Route path="academy/courses/:id/edit" element={<CourseForm />} />
            <Route path="academy/trainers" element={<AcademyTrainers />} />
            <Route path="academy/trainers/new" element={<TrainerForm />} />
            <Route path="academy/trainers/:id/edit" element={<TrainerForm />} />
            <Route path="academy/students" element={<AcademyStudents />} />
            <Route path="academy/enrollments" element={<AcademyEnrollments />} />
            <Route path="academy/analytics" element={<AcademyAnalytics />} />
            <Route path="hr" element={<HRDashboard />} />
            <Route path="hr/employees" element={<Employees />} />
            <Route path="hr/employees/new" element={<EmployeeForm />} />
            <Route path="hr/employees/:id/edit" element={<EmployeeForm />} />
            <Route path="hr/payrolls" element={<Payrolls />} />
            <Route path="hr/payrolls/new" element={<PayrollForm />} />
            <Route path="hr/payrolls/:id" element={<PayrollForm />} />
            <Route path="hr/attendance" element={<Attendance />} />
            <Route path="accounting" element={<AccountingDashboard />} />
            <Route path="accounting/expenses" element={<Expenses />} />
            <Route path="accounting/expenses/new" element={<ExpenseForm />} />
            <Route path="accounting/expenses/:id/edit" element={<ExpenseForm />} />
            <Route path="accounting/accounts" element={<Accounts />} />
            <Route path="accounting/accounts/new" element={<AccountForm />} />
            <Route path="accounting/accounts/:id/edit" element={<AccountForm />} />
            <Route path="accounting/transactions" element={<Transactions />} />
            <Route path="accounting/transactions/new" element={<TransactionForm />} />
            <Route path="accounting/transactions/:id/edit" element={<TransactionForm />} />
            <Route path="accounting/reports" element={<Reports />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all route for unauthorized admin access */}
          <Route path="/admin/*" element={<AccessDenied />} />
                </Routes>
              </Suspense>
              <CookieBanner />
              <GlobalMetaManager />
            </div>
          </NotificationProvider>
        </CartProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
}

export default App;
