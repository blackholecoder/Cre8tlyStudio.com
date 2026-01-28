import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AuthProviderWithRouter from "./admin/AuthProviderWithRouter.jsx";
import { MagnetProvider } from "./admin/MagnetContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NotFound from "./components/NotFound.jsx";
import ThankYou from "./sections/ThankYou.jsx";
import Terms from "./documents/Terms.jsx";
import Privacy from "./documents/Privacy.jsx";
import Refund from "./documents/Refund.jsx";
import Cookie from "./documents/Cookie.jsx";
import PromptPage from "./sections/PromptPage.jsx";
import SignupPage from "./sections/SignUp.jsx";
import { Landing, Login } from "./sections/index.js";
import CustomerDashboard from "./sections/CustomerDashboard.jsx";
import AdminDashboard from "./sections/AdminDashboard.jsx";
import Contact from "./sections/Contact.jsx";
import PlansPage from "./sections/PlansPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import "./index.css";
import ForgotPassword from "./admin/ForgotPassword.jsx";
import ResetPassword from "./admin/ResetPassword.jsx";
import EbooksStore from "./sections/EbookStore.jsx";
import BooksDashboard from "./sections/BooksDashboard.jsx";
import { BookProvider } from "./admin/BookContext.jsx";
import SettingsPage from "./sections/SettingsPage.jsx";
import DashboardLayout from "./components/layouts/DashboardLayout.jsx";
import PromptMemoryDashboard from "./components/prompt/PromptMemoryDashboard.jsx";
import Inbox from "./sections/Inbox.jsx";
import useMaintenance from "./settings/UseMaintenance.jsx";
import MaintenanceScreen from "./settings/MaintenanceScreen.jsx";
import CanvasEditor from "./components/canvas/CanvasEditor.jsx";
import LandingPageBuilder from "./sections/landing/LandingPageBuilder.jsx";
import Leads from "./sections/Leads.jsx";
import LandingAnalytics from "./sections/analytics/Analytics.jsx";
import SellerDashboard from "./sections/seller/SellerDashboard.jsx";
import CommunityPost from "./sections/community/CommunityPost.jsx";
import CommunityTopic from "./sections/community/CommunityTopic.jsx";
import CommunityHome from "./sections/community/CommunityHome.jsx";
import Notifications from "./sections/community/notifications/Notifications.jsx";
import Careers from "./documents/Careers.jsx";
import DocsIndexPage from "./sections/docs/DocsIndexPage.jsx";
import LeadMagnet from "./sections/docs/LeadMagnet.jsx";
import ProDocuments from "./sections/docs/ProDocument.jsx";
import SmartPromptDocs from "./sections/docs/SmartPrompt.jsx";
import CanvasEditorDocs from "./sections/docs/CanvasEditorDocs.jsx";
import SettingsDocs from "./sections/docs/SettingsPageDocs.jsx";
import LandingBuilderDocs from "./sections/docs/LandingPageBuilderDocs.jsx";
import SellerDashboardDocs from "./sections/docs/SellerDashboardDocs.jsx";
import LandingAnalyticsDocs from "./sections/docs/AnalyticsDocs.jsx";
import Resources from "./sections/landing/Resources.jsx";
import ResourcesVideos from "./sections/landing/ResourcesVideos.jsx";
import SmartPromptPage from "./sections/landing/SmartPromptPage.jsx";
import SiteLayout from "./components/layouts/SiteLayout.jsx";
import LandingInfoPage from "./sections/landing/LandingInfoPage.jsx";
import AnalyticsFeaturePage from "./sections/AnalyticsFeaturePage.jsx";
import CommunityFeaturePage from "./sections/CommunityFeaturePage.jsx";
import StripePayments from "./sections/StripePayments.jsx";
import AuthorsAssistant from "./sections/AuthorsAssistantPage.jsx";
import SettingsDomains from "./settings/SettingsDomains.jsx";
import CustomDomainsDocs from "./sections/docs/CustomDomainsDocs.jsx";
import AuthorsAssistantDocs from "./sections/docs/AuthorsAssistantDocs.jsx";
import SignupCommunity from "./sections/SignupCommunity.jsx";
import MyPosts from "./sections/community/posts/MyPosts.jsx";
import Subscriptions from "./sections/community/subscriptions/Subscriptions.jsx";
import ProfileSettings from "./sections/community/authors/ProfileSettings.jsx";
import Profile from "./sections/community/authors/ProfilePage.jsx";
import InviteAccept from "./sections/community/subscriptions/InviteAccept.jsx";
import EmailTemplates from "./sections/community/templates/EmailTemplates.jsx";
import CreatePostPage from "./sections/community/CreatePostPage.jsx";
import CommunitySubscribers from "./sections/community/subscriptions/CommunitySubscribers.jsx";

const AnimatedRoutes = () => {
  const location = useLocation();
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.add(savedTheme);

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        {/* Public site */}
        <Route element={<SiteLayout />}>
          <Route
            index
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Landing />
              </motion.div>
            }
          />

          <Route path="contact" element={<Contact />} />
          <Route path="shop" element={<EbooksStore />} />

          <Route path="terms" element={<Terms />} />
          <Route path="privacy-policy" element={<Privacy />} />
          <Route path="refund-policy" element={<Refund />} />
          <Route path="cookie-policy" element={<Cookie />} />
          <Route path="careers" element={<Careers />} />

          <Route path="smart-prompt" element={<SmartPromptPage />} />
          <Route path="landing" element={<LandingInfoPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="/signup-community" element={<SignupCommunity />} />

          <Route path="resources" element={<Resources />}>
            <Route path="videos" element={<ResourcesVideos />} />
          </Route>
          <Route path="analytics" element={<AnalyticsFeaturePage />} />
          <Route path="community-feature" element={<CommunityFeaturePage />} />
          <Route path="stripe-payments" element={<StripePayments />} />
          <Route path="authors-assistant" element={<AuthorsAssistant />} />

          {/* Auth */}
          <Route path="sign-up" element={<SignupPage />} />
          <Route path="login" element={<Login />} />

          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="/community/invites/:token" element={<InviteAccept />} />
        </Route>

        {/* Redirect old /home to / */}

        <Route path="/canvas-editor" element={<CanvasEditor />} />
        <Route
          path="/settings"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/domains"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <SettingsDomains />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route path="books" element={<BooksDashboard />} />
        <Route path="thank-you" element={<ThankYou />} />
        <Route path="prompt" element={<PromptPage />} />
        <Route
          path="/community"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CommunityHome />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community-alerts"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />

        <Route
          path="/community/topic/:topicId"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CommunityTopic />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/post/:slug"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CommunityPost />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/subscriptions"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <Subscriptions />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/subscriptions/subscribers"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CommunitySubscribers />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/authors/:authorUserId/subscribers"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CommunitySubscribers />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/settings"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <ProfileSettings />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/profile"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/profile/:userId"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/authors/:userId"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/posts"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <MyPosts />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/email-templates"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <EmailTemplates />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/create-post"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CreatePostPage />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/edit-post/:postId"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CreatePostPage isEdit />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />

        <Route
          path="/seller-dashboard"
          element={
            <PrivateRoute role={["marketer", "admin", "customer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen"
              >
                <DashboardLayout>
                  <SellerDashboard />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />

        <Route
          path="/prompts"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <DashboardLayout>
                  <PromptMemoryDashboard />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <DashboardLayout>
                  <Inbox />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />

        {/* Private */}

        <Route
          path="/landing-page-builder"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <LandingPageBuilder />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/landing-analytics"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <LandingAnalytics />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <Leads />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <CustomerDashboard />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <DocsIndexPage />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/lead-magnets"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <LeadMagnet />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/pro-documents"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <ProDocuments />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/smartprompt"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <SmartPromptDocs />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/canvas-editor"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CanvasEditorDocs />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/settings"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <SettingsDocs />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/landing-page-builder"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <LandingBuilderDocs />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/seller-dashboard"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <SellerDashboardDocs />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/analytics-docs"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <LandingAnalyticsDocs />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/custom-domain"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <CustomDomainsDocs />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/docs/authors-assistant"
          element={
            <PrivateRoute role={["customer", "admin", "marketer"]}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <DashboardLayout>
                  <AuthorsAssistantDocs />
                </DashboardLayout>
              </motion.div>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen bg-[#030712]"
              >
                <AdminDashboard />
              </motion.div>
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// 🔹 Root wrapper with Router outside (fixes useLocation error)
const RootApp = () => {
  const { maintenance, loading } = useMaintenance();

  if (loading) return null; // optional spinner

  if (maintenance) {
    // 🛑 Show only this, hide Nav, Routes, etc.
    return <MaintenanceScreen />;
  }

  return (
    <Router>
      <AuthProviderWithRouter>
        <BookProvider>
          <MagnetProvider>
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              pauseOnHover
              draggable
              theme="colored"
            />
            <AnimatedRoutes />
          </MagnetProvider>
        </BookProvider>
      </AuthProviderWithRouter>
    </Router>
  );
};

// 🔹 Create root only once
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RootApp />);
