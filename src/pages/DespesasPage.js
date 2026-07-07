// src/pages/DespesasPage.js
import { useState, useEffect, useCallback } from 'react';
import { getProjects, addExpense } from '../services/projectService'; // <-- Importa a funcao de salvar

function DespesasPage({ user }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Memoria do formulario para o React guardar o que voce digita
    const [formData, setFormData] = useState({
        projetoId: '',
        description: '',
        category: '',
        amount: ''
    });

    const loadData = useCallback(async () => {
    try {
        const data = await getProjects(user.id);
        setProjects(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
}, [user.id]);

    useEffect(() => {
    loadData();
}, [loadData]);

    // Garante que a caixinha comece selecionada no primeiro projeto da lista
    useEffect(() => {
    if (projects.length > 0 && !formData.projetoId) {
        setFormData(prev => ({
            ...prev,
            projetoId: projects[0].id
        }));
    }
}, [projects, formData.projetoId]);

    // Atualiza o estado do React em tempo real enquanto voce digita
    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    // O cerebro do botao "Salvar Despesa"
    async function handleSubmit(event) {
        event.preventDefault(); // <-- ISSO AQUI EVITA O "?" NA URL E O REDIRECIONAMENTO!

        try {
            // Envia o pacote completo (com o ID do projeto) para o Axios
            await addExpense(formData);

            // Atualiza a listagem de baixo buscando os dados novos do Banco
            await loadData();

            // Limpa os campos de texto para o proximo cadastro
            setFormData(prev => ({
                ...prev,
                description: '',
                category: '',
                amount: ''
            }));

            alert("Despesa cadastrada com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar despesa. Verifique se o Back-end esta rodando.");
        }
    }

    const allExpenses = projects.flatMap(p => p.expenses.map(e => ({ ...e, projectName: p.name })));

    if (loading) return <p>Carregando despesas...</p>;

    return (
        <div className="projects-page">
            <header className="page-header">
                <div>
                    <h1>Gestão de Despesas</h1>
                    <p>Visualize e controle todos os gastos realizados nos seus projetos.</p>
                </div>
            </header>

            <section className="project-workspace">

                {/* O formulario agora tem o onSubmit correto ligado ao React */}
                <form className="project-form" onSubmit={handleSubmit}>
                    <h2>Registrar Gasto</h2>

                    <div className="form-field">
                        <label>Projeto</label>
                        <select name="projetoId" value={formData.projetoId} onChange={handleInputChange} required>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Descrição</label>
                        <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Ex: Monitor Dell 24" required />
                    </div>

                    {/* Esse campo de Categoria PRECISA aparecer na tela */}
                    <div className="form-field">
                        <label>Categoria</label>
                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Ex: Equipamentos" required />
                    </div>

                    <div className="form-field">
                        <label>Valor (R$)</label>
                        <input type="number" name="amount" min="0" step="0.01" value={formData.amount} onChange={handleInputChange} required />
                    </div>

                    <button type="submit">Salvar Despesa</button>
                </form>

                <div className="project-list">
                    <h2>Histórico de Gastos</h2>
                    {allExpenses.length === 0 ? (
                        <p>Nenhuma despesa encontrada.</p>
                    ) : (
                        allExpenses.map(exp => (
                            <article key={exp.id} className="expense-card">
                                <div>
                                    <strong>{exp.description}</strong>
                                    <span>Projeto: {exp.projectName} | {exp.category}</span>
                                </div>
                                <strong style={{ color: '#dc2626' }}>
                                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exp.amount)}
                                </strong>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default DespesasPage;