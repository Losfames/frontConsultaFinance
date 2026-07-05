// src/pages/DashboardPage.js
import { useState } from 'react';
import ProjectsPage from './ProjectsPage';
import DespesasPage from './DespesasPage';
import DashboardContent from './DashboardContent';

function DashboardPage({ user, onLogout }) {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Novo estado: Controla se a barra lateral está "fixada" (aberta)
    const [isSidebarPinned, setIsSidebarPinned] = useState(false);

    function toggleSidebar() {
        setIsSidebarPinned(!isSidebarPinned);
    }

    return (
        <main className="dashboard-layout">
            {/* Adicionamos a classe 'pinned' dinamicamente se o estado for true */}
            <aside
                className={`sidebar ${isSidebarPinned ? 'pinned' : ''}`}
                // Só fecha as configurações ao tirar o mouse se a barra NÃO estiver fixada
                onMouseLeave={() => !isSidebarPinned && setIsSettingsOpen(false)}
            >

                {/* Botão de abrir/fechar a barra (Estilo Gemini) */}
                <div className="sidebar-toggle-container">
                    <button
                        type="button"
                        className="toggle-sidebar-btn"
                        onClick={toggleSidebar}
                        title={isSidebarPinned ? "Recolher barra lateral" : "Abrir barra lateral"}
                    >
                        <i className={`fa-solid ${isSidebarPinned ? 'fa-chevron-left' : 'fa-bars'}`}></i>
                    </button>
                </div>

                <div className="sidebar-brand">
                    <span className="brand-icon">CF</span>
                    <div className="brand-text">
                        <strong>ConsultaFinance</strong>
                        <span>{user.name}</span>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <button
                        type="button"
                        className={activeMenu === 'dashboard' ? 'menu-item active' : 'menu-item'}
                        onClick={() => setActiveMenu('dashboard')}
                    >
                        <i className="fa-solid fa-chart-line menu-icon"></i>
                        <span className="menu-label">Dashboard</span>
                    </button>

                    <button
                        type="button"
                        className={activeMenu === 'projects' ? 'menu-item active' : 'menu-item'}
                        onClick={() => setActiveMenu('projects')}
                    >
                        <i className="fa-solid fa-folder-open menu-icon"></i>
                        <span className="menu-label">Projetos</span>
                    </button>

                    <button
                        type="button"
                        className={activeMenu === 'expenses' ? 'menu-item active' : 'menu-item'}
                        onClick={() => setActiveMenu('expenses')}
                    >
                        <i className="fa-solid fa-receipt menu-icon"></i>
                        <span className="menu-label">Despesas</span>
                    </button>

                    <button
                        type="button"
                        className={isSettingsOpen ? 'menu-item active' : 'menu-item'}
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >
                        <i className="fa-solid fa-gear menu-icon"></i>
                        <span className="menu-label">Configurações</span>
                    </button>

                    {isSettingsOpen && (
                        <div className="submenu">
                            <button type="button" className="submenu-item" onClick={onLogout}>
                                <i className="fa-solid fa-arrow-right-from-bracket menu-icon"></i>
                                <span className="menu-label">Logout</span>
                            </button>
                        </div>
                    )}
                </nav>
            </aside>

            <section className="dashboard-content">
                {activeMenu === 'dashboard' && <DashboardContent user={user} />}
                {activeMenu === 'projects' && <ProjectsPage user={user} />}
                {activeMenu === 'expenses' && <DespesasPage user={user} />}
            </section>
        </main>
    );
}

export default DashboardPage;