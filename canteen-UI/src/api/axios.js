import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:8080",
  baseURL:"https://canteen-xhhg.onrender.com",
  withCredentials: true
});

// Attach access token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }

  return config;
});

// Handle refresh automatically
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        const res = await api.post("/auth/refresh");

        localStorage.setItem("accessToken", res.data);

        error.config.headers["Authorization"] =
          "Bearer " + res.data;

        return api(error.config);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
