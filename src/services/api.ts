import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('medly_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            const message =
                data?.message ||
                data?.error ||
                (typeof data === 'string' ? data : null);

            if (message && [400, 403, 404, 409, 422].includes(status)) {
                error.message = message;
            }
        }
        return Promise.reject(error);
    }
);