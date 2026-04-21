import { apiClient, endpoints } from '@/lib/api/index';

const login = async (data: { email: string; password: string }) => {
    const response = await apiClient.post(endpoints.auth.login, {
        ...data,
    });
    return response.data;
};



export { login };