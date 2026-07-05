// src/services/authService.js
import api from './api';

// Função para fazer Login real
export async function login({ email, password }) {
    try {
        // Faz o POST para a rota /api/Auth/login do seu C#
        const response = await api.post('/Auth/login', {
            email: email,
            senha: password // Atributo mapeado igual ao LoginDTO do seu back-end
        });

        // Se a API devolveu o token, salvamos no navegador
        if (response.data && response.data.token) {
            localStorage.setItem('consultaFinance:token', response.data.token);

            // Criamos um objeto de usuário mockado a partir do email para o React não quebrar nas telas
            const user = {
                id: 1, // O back-end pode estender isso se necessário
                name: email.split('@')[0], // Pega a primeira parte do e-mail como nome
                email: email
            };

            return { user };
        }

        throw new Error('Falha na autenticação.');
    } catch (error) {
        // Captura as mensagens de erro vindas diretamente do C# (ex: "Email ou senha inválidos.")
        const message = error.response?.data || 'Erro ao conectar com o servidor.';
        throw new Error(message);
    }
}

// Função para Registrar conta real
export async function register({ name, email, password }) {
    try {
        // Faz o POST para a rota /api/Auth/register do seu C#
        await api.post('/Auth/register', {
            nome: name,
            email: email,
            senha: password
        });

        // Após registrar com sucesso, faz o login automático
        return await login({ email, password });
    } catch (error) {
        const message = error.response?.data || 'Erro ao criar conta.';
        throw new Error(message);
    }
}