import { apiClient, endpoints } from './base';


export const login = async (email: string, password: string) => {
    const response = await apiClient.post(endpoints.auth.login, { email, password });
    const { accessToken, globalRole, user, activeStore } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify({ ...user, globalRole, activeStore }));
    console.log(response);

    return { globalRole, user, activeStore };
};


