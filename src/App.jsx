import { Routes, Route, useLocation } from "react-router-dom";

import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";

// pages imports
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ScanPrescription from "./pages/ScanPrescription";
import MyPrescriptions from "./pages/MyPrescriptions";
import PrescriptionDetails from "./pages/PrescriptionDetails";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";

function AppLayout() {
  const location = useLocation();

  // ❌ Pages where nav should NOT appear
  const hideNavRoutes = ["/", "/login", "/signup"];

  const hideNav = hideNavRoutes.includes(location.pathname);

  return (
    <>
      {/* 🔝 TOP NAV */}
      {!hideNav && <TopNav />}

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan" element={<ScanPrescription />} />
        <Route path="/prescriptions" element={<MyPrescriptions />} />
        <Route path="/prescriptions/:id" element={<PrescriptionDetails />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* 📱 BOTTOM NAV */}
      {!hideNav && <BottomNav />}
    </>
  );
}

export default AppLayout;
