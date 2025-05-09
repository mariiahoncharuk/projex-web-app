// src/utils/axiosInstance.js
import axios from 'axios';

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Make sure this is your correct API base URL
  withCredentials: true, // ✅ Enable HTTP-Only Cookie Support (for refresh token)
});

// ✅ Attach the access token to every request dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ [AXIOS] Attached Bearer Token to request:", token);
    } else {
      console.warn("⚠️ [AXIOS] No access token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("❌ [AXIOS] Error attaching token to request:", error);
    return Promise.reject(error);
  }
);

// ✅ Automatically refresh token on 401 Unauthorized response
axiosInstance.interceptors.response.use(
  (response) => response, // ✅ Pass successful responses directly
  async (error) => {
    const originalRequest = error.config;

    // ✅ If the error is 401 Unauthorized (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("⚠️ [AXIOS] Access token expired. Attempting refresh...");

      try {
        // ✅ Request a new access token using the refresh token (HTTP-Only Cookie)
        const response = await axiosInstance.post('/auth/refresh-token');

        const { token } = response.data;
        console.log("✅ [AXIOS] Token refreshed successfully.");

        // ✅ Store the new access token
        localStorage.setItem('token', token);

        // ✅ Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ [AXIOS] Error refreshing token:", refreshError);
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Logout User (Clear tokens and redirect)
const logoutUser = () => {
  console.warn("✅ [AXIOS] Logging out user...");
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/';
};

export default axiosInstance;
