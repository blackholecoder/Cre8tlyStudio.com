
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import App from "./App.jsx";
import NotFound from "./components/NotFound.jsx";
import ThankYou from "./sections/ThankYou.jsx";
import Bio from "./sections/Bio.jsx";
import DeleteData from "./components/DeleteData.jsx";
import Terms from "./documents/Terms.jsx";
import Privacy from "./documents/Privacy.jsx";
import Refund from "./documents/Refund.jsx";
import Cookie from "./documents/Cookie.jsx";
import "./index.css";
import SupportPage from "./sections/Support.jsx";

const RootComponent = () => {
  
  
  return (
    <Router>
      <Routes>
        <Route path="/support" element={<SupportPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/drama-bio" element={<Bio />} />
        <Route path="/" element={<App />} />
        <Route path="/features" element={<App />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/refund-policy" element={<Refund />} />
        <Route path="/cookie-policy" element={<Cookie />} />
        <Route path="/delete-account" element={<DeleteData />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};


const container = document.getElementById("root");

// Only create the root if it doesn't already exist
const root = createRoot(container);
root.render(<RootComponent />);

