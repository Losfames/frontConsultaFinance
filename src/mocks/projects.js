// Projetos falsos para testar a tela enquanto o backend ainda nao existe.
// Depois estes dados devem vir da API em C#.
export const mockProjects = [
  {
    id: 1,
    name: 'Controle Financeiro Interno',
    ownerId: 1,
    ownerName: 'Administrador',
    budget: 25000,
    status: 'Em andamento',
    description: 'Projeto artificial criado para testar listagem, edicao, exclusao e despesas.',
    expenses: [
      {
        id: 1,
        description: 'Assinatura de software financeiro',
        category: 'Software',
        amount: 8200,
      },
    ],
  },
];
