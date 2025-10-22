import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const sendOtp = (data) => API.post("/auth/sendOtp", data);
export const verifyOtp = (data) => API.post("/auth/verifyOtp", data);
export const resetPassword = (data) => API.post("/auth/resetPassword", data);
