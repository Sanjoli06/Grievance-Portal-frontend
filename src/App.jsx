import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route (Login / Signup page) */}
        <Route path="/login" element={<AuthPage />} />

        {/* Admin Dashboard (Protected Route Example) */}
        <Route path="/admin" element={<AdminDashboard />}/>

        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
