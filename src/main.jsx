
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, useLocation, Routes, Route, Navigate } from "react-router-dom";
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
import SupportPage from "./sections/Support.jsx";
import PromptPage from "./sections/PromptPage.jsx";
import SignupPage from "./sections/SignUp.jsx";
import { Login, Nav } from "./sections/index.js";
import CustomerDashboard from "./sections/CustomerDashboard.jsx";
import AdminDashboard from "./sections/AdminDashboard.jsx";
import Contact from "./sections/Contact.jsx";
import PlansPage from "./sections/PlansPage.jsx";
import App from "./App.jsx";
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


const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        {/* Public site */}
        <Route
    path="/"
    element={
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <App />
      </motion.div>
    }
  />

  {/* Redirect old /home to / */}
  <Route path="/home" element={<Navigate to="/" replace />} />
  <Route
  path="/settings"
  element={
    <PrivateRoute role={["customer", "admin"]}>
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
  path="/prompts"
  element={
    <PrivateRoute role={["customer", "admin"]}>
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
          path="/support"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="min-h-screen bg-[#030712]"
            >
              <SupportPage />
            </motion.div>
          }
        />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<EbooksStore />} />
        <Route path="/books" element={<BooksDashboard />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/refund-policy" element={<Refund />} />
        <Route path="/cookie-policy" element={<Cookie />} />
        <Route path="/prompt" element={<PromptPage />} />

        {/* Auth */}
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Private */}
        <Route
  path="/plans"
  element={
    <PrivateRoute role={["customer", "admin"]}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <PlansPage />
      </motion.div>
    </PrivateRoute>
  }
/>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role={["customer", "admin"]}>
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

        {/* Debug */}
        <Route
          path="/debug"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                backgroundColor: "#030712",
                color: "#fff",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Debug Test Page
            </motion.div>
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
  return (
    <Router>
      <AuthProviderWithRouter>
        <BookProvider>
        <MagnetProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <Nav />
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

