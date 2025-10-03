import AuthProviderWithRouter from "./admin/AuthProviderWithRouter.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import App from "./App.jsx";
import NotFound from "./components/NotFound.jsx";
import ThankYou from "./sections/ThankYou.jsx";
import Terms from "./documents/Terms.jsx";
import Privacy from "./documents/Privacy.jsx";
import Refund from "./documents/Refund.jsx";
import Cookie from "./documents/Cookie.jsx";
import "./index.css";
import SupportPage from "./sections/Support.jsx";
import PromptPage from "./sections/PromptPage.jsx";
import "react-quill/dist/quill.snow.css";
import SignupPage from "./sections/SignUp.jsx";
import { Login, Nav } from "./sections/index.js";
import CustomerDashboard from "./sections/CustomerDashboard.jsx";
import AdminDashboard from "./sections/AdminDashboard.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RootComponent = () => {
  
  
  return (
      
    <Router>
      <AuthProviderWithRouter>
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
      <Nav/>  
      <Routes>
        <Route path="/support" element={<SupportPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<App />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/prompt" element={<PromptPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/refund-policy" element={<Refund />} />
        <Route path="/cookie-policy" element={<Cookie />} />
        <Route path="*" element={<NotFound />} />

        {/* Private */}
        <Route
    path="/dashboard"
    element={
      <PrivateRoute role="customer">
        <CustomerDashboard />
      </PrivateRoute>
    }
  />
  <Route
    path="/admin"
    element={
      <PrivateRoute role="admin">
        <AdminDashboard />
      </PrivateRoute>
    }
  />
      </Routes>
      </AuthProviderWithRouter>
    </Router>
    
  );
};


const container = document.getElementById("root");

// Only create the root if it doesn't already exist
const root = createRoot(container);
root.render(<RootComponent />);

