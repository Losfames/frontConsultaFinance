import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backconsulta-finance.onrender.com/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('consultaFinance:token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;