// src/services/api.js
import axios from 'axios';

// Configura o endereço base da sua API em C#
const api = axios.create({
    baseURL: 'https://backconsulta-finance.onrender.com', // Confira se a porta do seu C# no Visual Studio é 5000
});

// Interceptor: Adiciona automaticamente o Token JWT em TODAS as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('consultaFinance:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;// JavaScript source code
