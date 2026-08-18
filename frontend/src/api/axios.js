import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Add access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh access token when it expires
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

if (!originalRequest) {
  return Promise.reject(error);
}

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refresh");

      if (!refreshToken) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("isAdmin");

        window.location.href = "/login";

        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/users/token/refresh/`,
  {
    refresh: refreshToken,
  }
);

        const newAccessToken =
          response.data.access;

        localStorage.setItem(
          "access",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Token refresh failed:",
          refreshError
        );

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("isAdmin");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;