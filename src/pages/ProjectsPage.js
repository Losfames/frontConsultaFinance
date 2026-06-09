import { useEffect, useState } from 'react';
import {
  addExpense,
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../services/projectService';

const emptyProjectForm = {
  name: '',
  budget: '',
  status: 'Em andamento',
  description: '',
};

const emptyExpenseForm = {
  description: '',
  category: '',
  amount: '',
};

function ProjectsPage({ user }) {
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [openedProjectId, setOpenedProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProjects() {
      const projectsFromService = await getProjects(user.id);
      setProjects(projectsFromService);
      setIsLoading(false);
    }

    loadProjects();
  }, [user.id]);

  const openedProject = projects.find((project) => project.id === openedProjectId);

  function handleProjectInputChange(event) {
    const { name, value } = event.target;

    setProjectForm((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleExpenseInputChange(event) {
    const { name, value } = event.target;

    setExpenseForm((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleEdit(project) {
    setOpenedProjectId(null);
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      budget: String(project.budget),
      status: project.status,
      description: project.description,
    });
  }

  function resetProjectForm() {
    setEditingProjectId(null);
    setProjectForm(emptyProjectForm);
    setError('');
  }

  async function handleProjectSubmit(event) {
    event.preventDefault();
    setError('');

    if (editingProjectId) {
      const updatedProject = await updateProject(editingProjectId, projectForm);

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      resetProjectForm();
      return;
    }

    const newProject = await createProject(projectForm, user);
    setProjects((currentProjects) => [...currentProjects, newProject]);
    resetProjectForm();
  }

  async function handleDelete(projectId) {
    await deleteProject(projectId);

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== projectId)
    );

    if (editingProjectId === projectId) {
      resetProjectForm();
    }

    if (openedProjectId === projectId) {
      setOpenedProjectId(null);
    }
  }

  async function handleExpenseSubmit(event) {
    event.preventDefault();
    setError('');

    const updatedProject = await addExpense(openedProjectId, expenseForm);

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    setExpenseForm(emptyExpenseForm);
  }

  if (isLoading) {
    return <p>Carregando projetos...</p>;
  }

  if (openedProject) {
    const totalSpent = sumExpenses(openedProject.expenses);
    const remainingBudget = openedProject.budget - totalSpent;
    const categories = [...new Set(openedProject.expenses.map((expense) => expense.category))];
    const chartItems = buildExpenseChartItems(openedProject.expenses);
    const topExpenses = [...openedProject.expenses]
      .sort((firstExpense, secondExpense) => secondExpense.amount - firstExpense.amount)
      .slice(0, 3);

    return (
      <div className="projects-page">
        <header className="page-header">
          <div>
            <p className="section-label">Pagina do projeto</p>
            <h1>{openedProject.name}</h1>
            <p>{openedProject.description}</p>
          </div>

          <button type="button" className="secondary-button" onClick={() => setOpenedProjectId(null)}>
            Voltar para projetos
          </button>
        </header>

        <section className="project-overview">
          <div className="project-info">
            <h2>Dados</h2>
            <p>Criado por: {openedProject.ownerName}</p>
            <p>Status: {openedProject.status}</p>
          </div>

          <div className="project-stats compact">
            <div>
              <span>Orcamento</span>
              <strong>{formatCurrency(openedProject.budget)}</strong>
            </div>
            <div>
              <span>Gasto</span>
              <strong>{formatCurrency(totalSpent)}</strong>
            </div>
            <div>
              <span>Saldo</span>
              <strong>{formatCurrency(remainingBudget)}</strong>
            </div>
            <div>
              <span>Categorias</span>
              <strong>{categories.length}</strong>
            </div>
          </div>

          <div className="expense-chart-compact">
            <div>
              <h2>Grafico de despesas</h2>
              <p>Ate 20 despesas.</p>
            </div>

            {chartItems.length > 0 ? (
              <div className="expense-chart-layout compact">
                <div
                  className="expense-pie-chart compact"
                  style={{ background: buildPieGradient(chartItems) }}
                  aria-label="Grafico de pizza das despesas"
                />

                <div className="top-expenses compact">
                  <h3>3 maiores valores</h3>
                  {topExpenses.map((expense) => (
                    <div key={expense.id} className="top-expense-item compact">
                      <span
                        className="expense-color"
                        style={{ backgroundColor: getExpenseColor(expense.id) }}
                      />
                      <span>{expense.description}</span>
                      <strong>{formatCurrency(expense.amount)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>Nenhuma despesa para exibir.</p>
            )}
          </div>
        </section>

        <section className="project-workspace">
          <form className="project-form" onSubmit={handleExpenseSubmit}>
            <h2>Cadastrar despesa</h2>

            <div className="form-field">
              <label htmlFor="expense-description">Descricao</label>
              <input
                id="expense-description"
                name="description"
                value={expenseForm.description}
                onChange={handleExpenseInputChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="expense-category">Categoria</label>
              <input
                id="expense-category"
                name="category"
                value={expenseForm.category}
                onChange={handleExpenseInputChange}
                placeholder="Ex: Software, Marketing, Viagem"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="expense-amount">Valor</label>
              <input
                id="expense-amount"
                name="amount"
                type="number"
                min="0"
                value={expenseForm.amount}
                onChange={handleExpenseInputChange}
                required
              />
            </div>

            <button type="submit">Cadastrar despesa</button>
          </form>

          <div className="project-list">
            <h2>Despesas</h2>

            {openedProject.expenses.length === 0 && <p>Nenhuma despesa cadastrada ainda.</p>}

            {openedProject.expenses.map((expense) => (
              <article key={expense.id} className="expense-card">
                <div>
                  <strong>{expense.description}</strong>
                  <span>{expense.category}</span>
                </div>
                <strong>{formatCurrency(expense.amount)}</strong>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <header className="page-header">
        <div>
          <h1>Projetos</h1>
          <p>Crie projetos e entre em cada um para ver dados financeiros e despesas.</p>
        </div>
      </header>

      <section className="project-workspace">
        <form className="project-form" onSubmit={handleProjectSubmit}>
          <h2>{editingProjectId ? 'Editar projeto' : 'Criar projeto'}</h2>

          <div className="form-field">
            <label htmlFor="project-name">Nome do projeto</label>
            <input
              id="project-name"
              name="name"
              value={projectForm.name}
              onChange={handleProjectInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="project-budget">Orcamento definido</label>
            <input
              id="project-budget"
              name="budget"
              type="number"
              min="0"
              value={projectForm.budget}
              onChange={handleProjectInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="project-status">Status</label>
            <select
              id="project-status"
              name="status"
              value={projectForm.status}
              onChange={handleProjectInputChange}
            >
              <option>Em andamento</option>
              <option>Pausado</option>
              <option>Finalizado</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="project-description">Descricao</label>
            <textarea
              id="project-description"
              name="description"
              value={projectForm.description}
              onChange={handleProjectInputChange}
              rows="4"
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="form-actions">
            <button type="submit">
              {editingProjectId ? 'Salvar alteracoes' : 'Criar projeto'}
            </button>
            {editingProjectId && (
              <button type="button" className="secondary-button" onClick={resetProjectForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="project-list">
          <h2>Projetos existentes</h2>

          {projects.length === 0 && <p>Nenhum projeto cadastrado ainda.</p>}

          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-card-main">
                <strong>{project.name}</strong>
                <span>{project.description}</span>
              </div>

              <div className="project-card-actions">
                <button type="button" onClick={() => setOpenedProjectId(project.id)}>
                  Entrar
                </button>
                <button type="button" className="secondary-button" onClick={() => handleEdit(project)}>
                  Editar
                </button>
                <button type="button" className="danger-button" onClick={() => handleDelete(project.id)}>
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function sumExpenses(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function buildExpenseChartItems(expenses) {
  const visibleExpenses = expenses.slice(0, 20);
  const total = sumExpenses(visibleExpenses);
  let currentPercent = 0;

  if (total === 0) {
    return [];
  }

  return visibleExpenses.map((expense, index) => {
    const start = currentPercent;
    const percent = (expense.amount / total) * 100;
    const end = index === visibleExpenses.length - 1 ? 100 : start + percent;
    currentPercent = end;

    return {
      id: expense.id,
      color: getExpenseColor(expense.id),
      start,
      end,
    };
  });
}

function buildPieGradient(chartItems) {
  const slices = chartItems.map(
    (item) => `${item.color} ${item.start}% ${item.end}%`
  );

  return `conic-gradient(${slices.join(', ')})`;
}

function getExpenseColor(expenseId) {
  const hue = (expenseId * 137) % 360;

  return `hsl(${hue}, 72%, 52%)`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default ProjectsPage;
