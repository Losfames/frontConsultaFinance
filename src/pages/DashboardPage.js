import { useState } from 'react';
import ProjectsPage from './ProjectsPage';

function DashboardPage({ user, onLogout }) {
  // Controla qual item do menu esta selecionado.
  const [activeMenu, setActiveMenu] = useState('projects');
  // Controla se o submenu de configuracoes esta aberto.
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  function handleSettingsClick() {
    // Ao clicar em Configuracoes, abrimos/fechamos apenas o submenu lateral.
    setIsSettingsOpen((currentValue) => !currentValue);
  }

  return (
    <main className="dashboard-layout">
      <aside className="sidebar" onMouseLeave={() => setIsSettingsOpen(false)}>
        <div className="sidebar-brand">
          <span className="brand-icon">CF</span>
          <div className="brand-text">
            <strong>ConsultaFinance</strong>
            <span>{user.name}</span>
          </div>
        </div>

        <nav className="sidebar-menu" aria-label="Menu principal">
          <button
            type="button"
            className={activeMenu === 'projects' ? 'menu-item active' : 'menu-item'}
            onClick={() => setActiveMenu('projects')}
          >
            <span className="menu-icon projects-icon" aria-hidden="true" />
            <span className="menu-label">Projetos</span>
          </button>

          <button
            type="button"
            className={isSettingsOpen ? 'menu-item active' : 'menu-item'}
            onClick={handleSettingsClick}
            aria-expanded={isSettingsOpen}
          >
            <svg
              className="menu-icon"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
            </svg>
            <span className="menu-label">Configuracoes</span>
            <span className="menu-arrow" aria-hidden="true">{isSettingsOpen ? '-' : '+'}</span>
          </button>

          {isSettingsOpen && (
            <div className="submenu">
              <button type="button" className="submenu-item" onClick={onLogout}>
                <span className="menu-icon logout-icon" aria-hidden="true" />
                <span className="menu-label">Logout</span>
              </button>
            </div>
          )}
        </nav>
      </aside>

      <section className="dashboard-content">
        {activeMenu === 'projects' && (
          <ProjectsPage user={user} />
        )}
      </section>
    </main>
  );
}

export default DashboardPage;
