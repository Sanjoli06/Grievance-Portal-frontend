import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  Zoom,
} from "@mui/material";
import { toast } from "react-toastify";
import "./AuthForm.css";
import api from "../../utils/api";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const defaultForm = { name: "", email: "", password: "", confirmPassword: "" };
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  // ✅ Strict email regex similar to backend .isEmail() validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ✅ Frontend validation — mirrors backend express-validator rules exactly
  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
    }

    // Email validation (same as backend .isEmail())
    if (!formData.email.trim()) {
      newErrors.email = "Please provide a valid email";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email";
    }

    // Password validation (same as backend)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters long";
      else if (!/[A-Z]/.test(formData.password))
        newErrors.password = "Password must contain at least one uppercase letter";
      else if (!/[a-z]/.test(formData.password))
        newErrors.password = "Password must contain at least one lowercase letter";
      else if (!/\d/.test(formData.password))
        newErrors.password = "Password must contain at least one number";
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
        newErrors.password = "Password must contain at least one special character";
    }

    if (!isLogin) {
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm Password is required";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Parse backend express-validator errors array
  const handleBackendValidationErrors = (backendErrorsArray) => {
    if (!Array.isArray(backendErrorsArray)) return;
    const mapped = {};
    backendErrorsArray.forEach((err) => {
      const field = err.param || "general";
      mapped[field] = err.msg;
    });
    setErrors((prev) => ({ ...prev, ...mapped }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: formData.email.trim(),
          password: formData.password,
        });

        const { token, message } = res.data;
        if (token) localStorage.setItem("token", token);
        toast.success(message || "Login successful!");
      } else {
        const res = await api.post("/auth/signup", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        toast.success(res.data.message || "Signup successful!");
        setIsLogin(true);
        setFormData(defaultForm);
      }
    } catch (err) {
      const backend = err.response?.data;
      if (backend?.errors) handleBackendValidationErrors(backend.errors);
      else if (backend?.message) setErrors({ general: backend.message });
      else setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-container">
      <Paper elevation={6} className="auth-box">
        <Zoom in={true}>
          <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
            {isLogin ? "Log in to your account" : "Create a new account"}
          </Typography>
        </Zoom>

        <Fade in={true}>
          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <Box mb={2}>
                <TextField
                  label="Full Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>
            )}

            <Box mb={2}>
              <TextField
                label="Email Address"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Box>

            {!isLogin && (
              <Box mb={2}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Box>
            )}

            {errors.general && (
              <Typography color="error" align="center" mb={2}>
                {errors.general}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.3, fontSize: "1rem", borderRadius: "10px" }}
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Creating..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </Button>
          </form>
        </Fade>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData(defaultForm);
              }}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthForm;
