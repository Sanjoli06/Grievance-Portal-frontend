import React, { useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import Sidebar from "./components/Common/SideBar";
import { jwtDecode } from "jwt-decode"; // install this: npm install jwt-decode
import { Box } from "@mui/material";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);

  const getRoleFromToken = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      const roleId = decoded.role;
      if (roleId === 1) return "citizen";
      if (roleId === 2) return "agent";
      if (roleId === 3) return "admin";
      return "citizen";
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
      return null;
    }
  }, [navigate]);

  const userRole = getRoleFromToken;

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("token");
    navigate("/login"); // redirect to login page
  };

  if (hideHeaderFooter || !userRole) {
    return (
      <Routes>
        {/* Default route (Login / Signup page) */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        {/* Redirect any unknown route to login if no token */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role={userRole} onLogout={handleLogout} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          transition: "margin-left 0.6s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth shift with sidebar width change
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Admin Dashboard (Protected Route Example) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Box>
  );
};



export default App;