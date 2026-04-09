import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            toast.error(fallbackMesssage[error.response.status] || 'Đã xảy ra lỗi, vui lòng thử lại sau');
        } else if (error.response && error.response.status >= 500) {
            toast.error(fallbackMesssage[error.response.status] || 'Lỗi máy chủ nội bộ, vui lòng thử lại sau');
        } else {
            toast.error('Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng của bạn');
        }
        return Promise.reject(error);
    }
);


const fallbackMesssage: Record<number, string> = {
    400: 'Dữ liệu gửi lên không hợp lệ, vui lòng kiểm tra lại',
    401: 'Không có quyền truy cập vào tài nguyên này, vui lòng đăng nhập lại',
    403: 'Không được phép truy cập tài nguyên này',
    404: 'Không tìm thấy tài nguyên yêu cầu',
    422: 'Dữ liệu gửi lên không hợp lệ vì có sự trùng lặp, vui lòng kiểm tra lại',
    429: 'Quá tải yêu cầu, vui lòng thử lại sau',
    500: 'Lỗi máy chủ nội bộ, vui lòng thử lại sau',
    503: 'Dịch vụ không khả dụng, vui lòng thử lại sau',
}

export default apiClient;