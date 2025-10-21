import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  Zoom,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import { toast } from "react-toastify";
import "./AuthForm.css";
import api from "../../utils/services/api";
import SocialIcon from "../SocialIcons/SocialIcon";


const AuthForm = () => {
  const [currentView, setCurrentView] = useState("login"); // 'login' | 'signup' | 'forgot'
  const [loading, setLoading] = useState(false);

  const defaultForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = currentView === "login";
  const isSignup = currentView === "signup";
  const isForgot = currentView === "forgot";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please provide a valid email";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email";
    }

    if (currentView !== "forgot") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        if (formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters long";
        else if (!/[A-Z]/.test(formData.password))
          newErrors.password = "Password must contain an uppercase letter";
        else if (!/[a-z]/.test(formData.password))
          newErrors.password = "Password must contain a lowercase letter";
        else if (!/\d/.test(formData.password))
          newErrors.password = "Password must contain a number";
        else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password))
          newErrors.password = "Password must contain a special character";
      }
    }

    if (isSignup) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm Password is required";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      if (isForgot) {
        toast.success(`Reset link sent to ${formData.email.trim()}`);
        setFormData(defaultForm);
        setCurrentView("login");
      } else if (isLogin) {
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
        setCurrentView("login");
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

  const getTitle = () => {
    if (isForgot) return "Forgot Password";
    if (isSignup) return "Create Account";
    return "Log in";
  };

  const getButtonText = () => {
    if (loading) {
      if (isForgot) return "Sending...";
      if (isLogin) return "Logging in...";
      return "Creating...";
    }
    if (isForgot) return "Continue";
    if (isSignup) return "Create Account";
    return "Login";
  };

  const toggleConfig = isLogin
    ? {
        prefix: "Don't have an account?",
        action: "Sign Up here",
        onClick: () => {
          setCurrentView("signup");
          setErrors({});
          setFormData(defaultForm);
        },
      }
    : isSignup
    ? {
        prefix: "Already have an account?",
        action: "Sign In here",
        onClick: () => {
          setCurrentView("login");
          setErrors({});
          setFormData(defaultForm);
        },
      }
    : {
        prefix: "Remember your password?",
        action: "Log in",
        onClick: () => {
          setCurrentView("login");
          setErrors({});
          setFormData(defaultForm);
        },
      };

  return (
    <Box className="auth-container">
      <Paper elevation={6} className="auth-box">
        <Zoom in={true}>
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            mb={3}
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            {getTitle()}
          </Typography>
        </Zoom>

        <Fade in={true}>
          <form onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <Box mb={2}>
                <TextField
                  placeholder="Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i
                          className="fa-solid fa-user"
                          style={{ color: "#888" }}
                        ></i>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            <Box mb={2}>
              <TextField
                placeholder="Email address"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i
                        className="fa-solid fa-envelope"
                        style={{ color: "#888" }}
                      ></i>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {currentView !== "forgot" && (
              <Box mb={2}>
                <TextField
                  placeholder="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i
                          className="fa-solid fa-lock"
                          style={{ color: "#888" }}
                        ></i>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {isSignup && (
              <Box mb={2}>
                <TextField
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i
                          className="fa-solid fa-lock"
                          style={{ color: "#888" }}
                        ></i>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {isLogin && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Remember me"
                />
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView("forgot");
                    setFormData(defaultForm);
                    setErrors({});
                  }}
                  underline="hover"
                  sx={{
                    p: 0,
                    color: "black", // <-- changed to black text
                    fontWeight: 500,
                    "&:hover": { color: "#27AE60" },
                  }}
                >
                  Forgot Password?
                </Link>
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
              fullWidth
              disabled={loading}
              sx={{
                py: 1.3,
                fontSize: "1rem",
                borderRadius: "30px",
                backgroundColor: "#27AE60",
                fontWeight: 600,
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0 4px 10px rgba(39, 174, 96, 0.3)",
                "&:hover": {
                  backgroundColor: "#239954ff",
                  boxShadow: "0 0 2px rgba(39, 174, 96, 0.5)",
                },
              }}
            >
              {getButtonText()}
            </Button>
          </form>
        </Fade>

        <Box className="auth-toggle">
          <Typography variant="body2" color="text.secondary">
            {toggleConfig.prefix}{" "}
            <Button onClick={toggleConfig.onClick}>
              {toggleConfig.action}
            </Button>
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.300" }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mx: 2, whiteSpace: "nowrap" }}
            >
              Or continue with
            </Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.300" }} />
          </Box>

          <Box className="auth-social-icons">
            {["facebook", "google", "apple"].map((platform) => (
              <IconButton
                key={platform}
                onClick={() => toast.info("Coming soon!")}
              >
                <SocialIcon platform={platform} />
              </IconButton>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthForm;
