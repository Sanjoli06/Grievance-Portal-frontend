import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const signupUser = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/signup`, data);
  return res;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/login`, data);
  return res;
};

export const sendOtp = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/sendOtp`, data);
  return res;
};

export const verifyOtp = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/verifyOtp`, data);
  return res;
};

export const resetPassword = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/resetPassword`, data);
  return res;
};

export const getAllUsers = async () => {
  const res = await axios.get(`${API_BASE}/admin/users`, getAuthHeader());
  return res;
};

export const updateUserDetails = async (id, data) => {
  const res = await axios.put(`${API_BASE}/admin/users/${id}`, data, getAuthHeader());
  return res;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/users/${id}`, getAuthHeader());
  return res;
};
