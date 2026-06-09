import { useEffect, useState } from 'react';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  // Guarda o usuario logado. Quando for null, mostramos a tela de login.
  const [user, setUser] = useState(null);
  // Controla qual tela aparece antes do usuario entrar: login ou cadastro.
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    // Ao abrir o site, tentamos recuperar um usuario salvo no navegador.
    // Isso evita que a pessoa perca o login ao atualizar a pagina.
    const savedUser = localStorage.getItem('consultaFinance:user');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function handleLogin(loggedUser) {
    // Depois que o login da certo, salvamos o usuario no navegador e no estado do React.
    localStorage.setItem('consultaFinance:user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  }

  function handleLogout() {
    // Para sair, apagamos o usuario salvo e voltamos para a tela de login.
    localStorage.removeItem('consultaFinance:user');
    setUser(null);
  }

  if (!user) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onRegister={handleLogin}
          onGoToLogin={() => setAuthView('login')}
        />
      );
    }

    // Passamos a funcao handleLogin para a pagina de login avisar o App quando entrar.
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToRegister={() => setAuthView('register')}
      />
    );
  }

  return <DashboardPage user={user} onLogout={handleLogout} />;
}

export default App;
