import axios from "axios";
import { API_URL } from "../config";   // 🔥 NEW

const API = axios.create({
  baseURL: API_URL,   // 🔥 CHANGED (no hardcoding)
});

// 🔥 ALWAYS ATTACH TOKEN (UNCHANGED LOGIC)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("🔑 TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;