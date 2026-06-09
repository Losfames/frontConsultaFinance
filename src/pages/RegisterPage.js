import { useState } from 'react';
import { register } from '../services/authService';

function RegisterPage({ onRegister, onGoToLogin }) {
  // Estados do formulario de cadastro.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    // Evita o recarregamento automatico do formulario HTML.
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    setIsLoading(true);

    try {
      // Hoje cria o usuario nos dados falsos. Depois isso vira POST para a API C#.
      const response = await register({ name, email, password });
      // Depois de cadastrar, ja entramos no sistema com o novo usuario.
      onRegister(response.user);
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <p>Novo acesso</p>
          <h1>Criar conta</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-email">E-mail</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-password">Senha</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength="6"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirm-password">Confirmar senha</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength="6"
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-switch">
          Ja tem conta?
          <button type="button" className="link-button" onClick={onGoToLogin}>
            Entrar
          </button>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
