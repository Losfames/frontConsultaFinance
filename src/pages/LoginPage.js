import { useState } from 'react';
import { login } from '../services/authService';

function LoginPage({ onLogin, onGoToRegister }) {
  // Cada useState controla uma informacao da tela.
  // email e password começam preenchidos para facilitar seus testes locais.
  const [email, setEmail] = useState('admin@consultafinance.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    // Impede o formulario de recarregar a pagina, que e o comportamento padrao do HTML.
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Chama o servico de login. Hoje ele usa dados falsos; depois pode chamar a API em C#.
      const response = await login({ email, password });
      // Avisa o App.js que o login deu certo.
      onLogin(response.user);
    } catch (loginError) {
      // Se o servico jogar um erro, mostramos a mensagem na tela.
      setError(loginError.message);
    } finally {
      // O finally roda dando certo ou errado, entao sempre tiramos o carregamento.
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <p>Gestao financeira</p>
          <h1>ConsultaFinance</h1>
        </div>

        {/* Quando clicar em Entrar, o React executa a funcao handleSubmit acima. */}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              // Sempre que digitar, atualizamos o estado email.
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              // Sempre que digitar, atualizamos o estado password.
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="test-user">Usuario de teste: admin@consultafinance.com / 123456</p>

        <p className="auth-switch">
          Ainda nao tem conta?
          <button type="button" className="link-button" onClick={onGoToRegister}>
            Criar cadastro
          </button>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
