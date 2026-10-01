/**
 * @file axios.js
 * @description Configures the shared HTTP client used by frontend API modules.
 *
 * Responsibilities:
 * - Attach credentials and access tokens to requests.
 * - Refresh expired access tokens and retry eligible requests.
 */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh access token when it expires
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only try to refresh an expired access token.
    // Do NOT refresh when login or refresh-token itself returns 401.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;