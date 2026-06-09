import { mockProjects } from '../mocks/projects';

// Simula GET /projects.
export async function getProjects(ownerId) {
  await fakeDelay(250);

  return mockProjects.filter((project) => project.ownerId === ownerId);
}

// Simula POST /projects.
export async function createProject(projectData, owner) {
  await fakeDelay(250);

  const newProject = {
    id: Date.now(),
    ...projectData,
    ownerId: owner.id,
    ownerName: owner.name,
    budget: Number(projectData.budget),
    expenses: [],
  };

  mockProjects.push(newProject);
  return newProject;
}

// Simula PUT /projects/{id}.
export async function updateProject(projectId, projectData) {
  await fakeDelay(250);

  const projectIndex = mockProjects.findIndex((project) => project.id === projectId);

  if (projectIndex === -1) {
    throw new Error('Projeto nao encontrado.');
  }

  const updatedProject = {
    ...mockProjects[projectIndex],
    ...projectData,
    budget: Number(projectData.budget),
  };

  mockProjects[projectIndex] = updatedProject;
  return updatedProject;
}

// Simula DELETE /projects/{id}.
export async function deleteProject(projectId) {
  await fakeDelay(250);

  const projectIndex = mockProjects.findIndex((project) => project.id === projectId);

  if (projectIndex === -1) {
    throw new Error('Projeto nao encontrado.');
  }

  mockProjects.splice(projectIndex, 1);
}

// Simula POST /projects/{id}/expenses.
export async function addExpense(projectId, expenseData) {
  await fakeDelay(250);

  const projectIndex = mockProjects.findIndex((project) => project.id === projectId);

  if (projectIndex === -1) {
    throw new Error('Projeto nao encontrado.');
  }

  const newExpense = {
    id: Date.now(),
    description: expenseData.description,
    category: expenseData.category,
    amount: Number(expenseData.amount),
  };

  const updatedProject = {
    ...mockProjects[projectIndex],
    expenses: [...mockProjects[projectIndex].expenses, newExpense],
  };

  mockProjects[projectIndex] = updatedProject;
  return updatedProject;
}

function fakeDelay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
