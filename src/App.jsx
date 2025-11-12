import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute.jsx";
import ResponsiveSidebar from "./components/Common/ResposiveSidebar.jsx";
const DRAWER_FULL = 240;
const DRAWER_COLLAPSED = 70;
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null); 
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      if (!["/login", "/signup"].includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const map = { 1: "citizen", 2: "agent", 3: "admin" };
      setRole(map[decoded.role] || "citizen");
    } catch (e) {
      console.error("Invalid token", e);
      localStorage.removeItem("token");
      setRole(null);
      navigate("/login", { replace: true });
    }
  }, [navigate, location.pathname]);
  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/login", { replace: true });
  };
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  if (!role || isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  const currentDrawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_FULL;
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <ResponsiveSidebar
        role={role}
        onLogout={handleLogout}
        onCollapseChange={setCollapsed}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.3s ease, width 0.3s ease",
          marginLeft: { xs: 0, md: `${currentDrawerWidth/8}px` },
          width: { xs: "100%", md: `calc(100% - ${currentDrawerWidth}px)` },
          pt: { xs: 2, sm: 3 },
          pb: 3,
          overflowX: "hidden",
          marginTop: `${12}px`,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin", "agent", "citizen"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}