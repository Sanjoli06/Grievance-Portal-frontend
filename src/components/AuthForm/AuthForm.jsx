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
import {
  signupUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../../utils/services/api";
import SocialIcon from "../SocialIcons/SocialIcon";

const AuthForm = () => {
  const [currentView, setCurrentView] = useState("login"); 
  const [loading, setLoading] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); 
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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
        if (forgotStep === 1) {
          const otpResponse = await sendOtp({ email: formData.email.trim() });
          toast.success(otpResponse.data.message || "OTP sent to your email!");
          setForgotStep(2);
        } else if (forgotStep === 2) {
          if (!otp) {
            setErrors({ otp: "OTP is required" });
            return;
          }
          const verifyResponse = await verifyOtp({
            email: formData.email.trim(),
            otp,
          });
          if (!verifyResponse.data.success) throw new Error("Invalid OTP!");
          toast.success("OTP verified! Please enter your new password.");
          setForgotStep(3);
        } else if (forgotStep === 3) {
          if (!formData.password || !formData.confirmPassword) {
            setErrors({ password: "Password fields cannot be empty" });
            return;
          }
          const resetResponse = await resetPassword({
            email: formData.email.trim(),
            otp,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          });
          toast.success(
            resetResponse.data.message || "Password reset successful!"
          );
          setFormData(defaultForm);
          setOtp("");
          setForgotStep(1);
          setCurrentView("login");
        }
      } else if (isLogin) {
        const res = await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        });

        const { token, message } = res.data;
        if (token) {
          if (rememberMe) {
            localStorage.setItem("token", token); 
          } else {
            sessionStorage.setItem("token", token); 
          }
        }
        toast.success(message || "Login successful!");
      } else {
        const res = await signupUser({
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
      else
        setErrors({
          general: err.message || "Something went wrong. Please try again.",
        });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isForgot) {
      if (forgotStep === 1) return "Forgot Password";
      if (forgotStep === 2) return "Enter OTP";
      if (forgotStep === 3) return "Reset Password";
    }
    if (isSignup) return "Create Account";
    return "Log in";
  };

  const getButtonText = () => {
    if (loading) {
      if (isForgot) return "Processing...";
      if (isLogin) return "Logging in...";
      return "Creating...";
    }
    if (isForgot) {
      if (forgotStep === 1) return "Send OTP";
      if (forgotStep === 2) return "Verify OTP";
      if (forgotStep === 3) return "Reset Password";
    }
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
          <Box sx={{ position: "relative", mb: 3 }}>
            {isForgot && forgotStep > 1 && (
              <IconButton
                onClick={() => {
                  if (forgotStep === 2) setForgotStep(1);
                  else if (forgotStep === 3) setForgotStep(2);
                  setErrors({});
                }}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  color: "black",
                  "&:hover": { color: "#27AE60" },
                }}
              >
                <i
                  className="fa-solid fa-arrow-left"
                  style={{ fontSize: "18px" }}
                ></i>
              </IconButton>
            )}

            <Typography
              variant="h5"
              fontWeight="bold"
              align="center"
              sx={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {getTitle()}
            </Typography>
          </Box>
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

            {!isForgot && (
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
            )}

            {isForgot && forgotStep === 1 && (
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
            )}

            {isForgot && forgotStep === 2 && (
              <Box mb={2}>
                <TextField
                  placeholder="Enter OTP"
                  name="otp"
                  fullWidth
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setErrors((prev) => ({ ...prev, otp: "" }));
                  }}
                  error={!!errors.otp}
                  helperText={errors.otp}
                />
              </Box>
            )}

            {isForgot && forgotStep === 3 && (
              <>
                <Box mb={2}>
                  <TextField
                    placeholder="New Password"
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
              </>
            )}

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
                  control={
                    <Checkbox
                      size="small"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
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
                    color: "black",
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
