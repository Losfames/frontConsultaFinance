import { mockUsers } from '../mocks/users';

// Esta funcao simula o endpoint de login do backend.
// Quando o C# estiver pronto, e aqui que voce pode trocar por fetch/axios.
export async function login({ email, password }) {
  // Simula um pequeno tempo de resposta, como se fosse uma chamada para servidor.
  await fakeDelay(400);

  // Procura um usuario que tenha o mesmo e-mail e a mesma senha digitados.
  const user = mockUsers.find(
    (mockUser) => mockUser.email === email && mockUser.password === password
  );

  if (!user) {
    // throw interrompe a funcao e manda o erro para o catch do LoginPage.
    throw new Error('E-mail ou senha invalidos.');
  }

  // Retornamos no mesmo estilo que uma API real costuma retornar: token + dados do usuario.
  return {
    token: 'token-falso-para-testes',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

// Esta funcao simula o endpoint de cadastro do backend.
export async function register({ name, email, password }) {
  await fakeDelay(400);

  const userAlreadyExists = mockUsers.some((mockUser) => mockUser.email === email);

  if (userAlreadyExists) {
    throw new Error('Ja existe um usuario com este e-mail.');
  }

  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    password,
  };

  // Como estamos usando mock, adicionamos o usuario na lista em memoria.
  // Se atualizar a pagina, esse cadastro some. Com backend real, iria para o banco.
  mockUsers.push(newUser);

  return {
    token: 'token-falso-para-testes',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  };
}

function fakeDelay(ms) {
  // Promise permite usar await na funcao login.
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
