// src/config.js
// Centralized API base URLs for all services
export const API_BASES = {
  auth: import.meta.env.VITE_API_AUTH_BASE || "http://localhost:6999",
  user: import.meta.env.VITE_API_USER_BASE || "http://localhost:6998",
  search: import.meta.env.VITE_API_SEARCH_BASE || "http://localhost:7001",
  analysis: import.meta.env.VITE_API_ANALYSIS_BASE || "http://localhost:7003",
  summariser: import.meta.env.VITE_API_SUMMARISER_BASE || "http://localhost:7002"
};
