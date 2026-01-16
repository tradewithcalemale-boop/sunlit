
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index";
import CVDatabase from "./pages/CVDatabase";
import ContactUs from "./pages/ContactUs";
import OurServices from "./pages/OurServices";
import LoginRegister from "./pages/LoginRegister";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cv-database" element={<CVDatabase />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/our-services" element={<OurServices />} />
        <Route path="/login-register" element={<LoginRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
