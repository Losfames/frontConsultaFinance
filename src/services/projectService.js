// src/services/projectService.js
import api from './api';

// 1. LISTAR PROJETOS (GET /Projetos)
export async function getProjects() {
    // O Axios busca os projetos e as despesas do usuário logado ao mesmo tempo
    const [projetosResponse, despesasResponse] = await Promise.all([
        api.get('/Projetos'),
        api.get('/Despesas')
    ]);

    const projetosApi = projetosResponse.data;
    const despesasApi = despesasResponse.data;

    // Traduz o formato do C# para o formato em inglês que o React espera
    return projetosApi.map((p) => {
        // Agrupa as despesas correspondentes a cada projeto
        const despesasDoProjeto = despesasApi.filter((d) => d.projetoId === p.id);

        return {
            id: p.id,
            name: p.nome,
            description: p.descricao,
            budget: p.orcamentoTotal,
            status: 'Em andamento',
            ownerName: p.usuario ? p.usuario.nome : 'Usuário',
            expenses: despesasDoProjeto.map((d) => ({
                id: d.id,
                description: d.descricao,
                category: d.categoria,
                amount: d.valorRealizado
            }))
        };
    });
}

// 2. CRIAR PROJETO (POST /Projetos)
export async function createProject(projectData, owner) {
    const payload = {
        nome: projectData.name,
        descricao: projectData.description,
        orcamentoTotal: Number(projectData.budget),
        dataInicio: new Date().toISOString(),
        dataFim: new Date().toISOString()
    };

    const response = await api.post('/Projetos', payload);
    const p = response.data;

    return {
        id: p.id,
        name: p.nome,
        description: p.descricao,
        budget: p.orcamentoTotal,
        status: 'Em andamento',
        ownerName: owner.name,
        expenses: []
    };
}

// 3. EDITAR PROJETO (PUT /Projetos/{id})
export async function updateProject(projectId, projectData) {
    const payload = {
        id: projectId,
        nome: projectData.name,
        descricao: projectData.description,
        orcamentoTotal: Number(projectData.budget),
        dataInicio: new Date().toISOString(),
        dataFim: new Date().toISOString()
    };

    await api.put(`/Projetos/${projectId}`, payload);

    const todosOsProjetos = await getProjects();
    return todosOsProjetos.find((p) => p.id === projectId);
}

// 4. APAGAR PROJETO (DELETE /Projetos/{id})
export async function deleteProject(projectId) {
    await api.delete(`/Projetos/${projectId}`);
}

// 5. ADICIONAR DESPESA (POST /Despesas)
export async function addExpense(expenseData) {
    const payload = {
        projetoId: expenseData.projetoId, // Lendo do pacote completo!
        descricao: expenseData.description,
        categoria: expenseData.category,
        valorRealizado: Number(expenseData.amount),
        valorOrcado: 0,
        data: new Date().toISOString()
    };

    await api.post('/Despesas', payload);

    const todosOsProjetos = await getProjects();
    return todosOsProjetos.find((p) => p.id === expenseData.projetoId);
}