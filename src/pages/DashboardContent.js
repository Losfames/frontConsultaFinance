// src/pages/DashboardContent.js
import { useState, useEffect } from 'react';
import { getProjects, exportarExcel } from '../services/projectService';

function DashboardContent({ user }) {
    const [stats, setStats] = useState({ orçado: 0, realizado: 0, saldo: 0, totalProjetos: 0 });

    useEffect(() => {
        async function calculateStats() {
            const projects = await getProjects(user.id);

            const totalOrcado = projects.reduce((acc, p) => acc + Number(p.budget), 0);
            const totalRealizado = projects.reduce((acc, p) =>
                acc + p.expenses.reduce((sum, e) => sum + e.amount, 0), 0
            );

            setStats({
                orçado: totalOrcado,
                realizado: totalRealizado,
                saldo: totalOrcado - totalRealizado,
                totalProjetos: projects.length
            });
        }
        calculateStats();
    }, [user.id]);

    const format = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="projects-page">
            <header className="page-header">
                <div>
                    <p className="section-label">Resumo Financeiro</p>
                    <h1>Dashboard</h1>
                </div>
                <button className="link-button" onClick={exportarExcel}>
                <i className="fa-solid fa-file-excel"></i> Exportar Excel
                </button>
            </header>

            {/* Usando a sua classe project-stats que já existe no CSS */}
            <section className="project-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <div>
                    <span>Total Orçado</span>
                    <strong style={{ color: '#2563eb' }}>{format(stats.orçado)}</strong>
                </div>
                <div>
                    <span>Total Realizado</span>
                    <strong style={{ color: '#dc2626' }}>{format(stats.realizado)}</strong>
                </div>
                <div style={{ background: stats.saldo >= 0 ? '#f0fdf4' : '#fef2f2' }}>
                    <span>Saldo Geral</span>
                    <strong style={{ color: stats.saldo >= 0 ? '#16a34a' : '#dc2626' }}>{format(stats.saldo)}</strong>
                </div>
                <div>
                    <span>Projetos Ativos</span>
                    <strong>{stats.totalProjetos}</strong>
                </div>
            </section>

            <section className="project-form" style={{ maxWidth: '100%', marginTop: '20px' }}>
                <h2>Análise de Orçamento</h2>
                <p>Você já utilizou <strong>{((stats.realizado / stats.orçado) * 100 || 0).toFixed(1)}%</strong> do orçamento total aprovado.</p>
                <div style={{ width: '100%', background: '#e2e8f0', height: '24px', borderRadius: '12px', overflow: 'hidden', marginTop: '10px' }}>
                    <div style={{
                        width: `${Math.min((stats.realizado / stats.orçado) * 100, 100)}%`,
                        background: '#2563eb',
                        height: '100%',
                        transition: 'width 0.5s ease'
                    }}></div>
                </div>
            </section>
        </div>
    );
}

export default DashboardContent;