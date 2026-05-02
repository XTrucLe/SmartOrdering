import axios from "axios";
import { endpoints } from "./endpoint";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const message =
      error.response?.data?.message ||
      fallbackMesssage[status] ||
      "Đã có lỗi xảy ra";

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await apiClient.post(endpoints.auth.refresh);

        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
const fallbackMesssage: Record<number, string> = {
  400: "Dữ liệu gửi lên không hợp lệ, vui lòng kiểm tra lại",
  401: "Không có quyền truy cập vào tài nguyên này, vui lòng đăng nhập lại",
  403: "Không được phép truy cập tài nguyên này",
  404: "Không tìm thấy tài nguyên yêu cầu",
  422: "Dữ liệu gửi lên không hợp lệ vì có sự trùng lặp, vui lòng kiểm tra lại",
  429: "Quá tải yêu cầu, vui lòng thử lại sau",
  500: "Lỗi máy chủ nội bộ, vui lòng thử lại sau",
  503: "Dịch vụ không khả dụng, vui lòng thử lại sau",
};

export { apiClient, endpoints };
