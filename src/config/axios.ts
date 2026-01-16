import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_PUBLIC_API_URL ||
    "https://thesis-backend-aggf.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 0, // No timeout
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
