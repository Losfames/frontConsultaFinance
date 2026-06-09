import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('renders login page', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /consultafinance/i })).toBeInTheDocument();
});

test('opens register page', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /criar cadastro/i }));

  expect(screen.getByRole('heading', { name: /criar conta/i })).toBeInTheDocument();
});

test('shows dashboard and settings logout after login', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }));

  expect(await screen.findByRole('heading', { name: /^projetos$/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /configuracoes/i }));

  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /configuracoes/i })).not.toBeInTheDocument();

  fireEvent.mouseLeave(screen.getByRole('complementary'));

  expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
});

test('creates edits and deletes a project', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }));

  expect((await screen.findAllByText(/controle financeiro interno/i)).length).toBeGreaterThan(0);

  fireEvent.change(screen.getByLabelText(/nome do projeto/i), {
    target: { value: 'Projeto Caixa Mensal' },
  });
  fireEvent.change(screen.getByLabelText(/orcamento definido/i), {
    target: { value: '10000' },
  });
  fireEvent.change(screen.getByLabelText(/descricao/i), {
    target: { value: 'Projeto para acompanhar entradas e saidas mensais.' },
  });

  fireEvent.click(screen.getByRole('button', { name: /^criar projeto$/i }));

  expect((await screen.findAllByText(/projeto caixa mensal/i)).length).toBeGreaterThan(0);

  const editButtons = screen.getAllByRole('button', { name: /editar/i });
  fireEvent.click(editButtons[editButtons.length - 1]);
  fireEvent.change(screen.getByLabelText(/nome do projeto/i), {
    target: { value: 'Projeto Caixa Editado' },
  });
  fireEvent.click(screen.getByRole('button', { name: /salvar alteracoes/i }));

  expect((await screen.findAllByText(/projeto caixa editado/i)).length).toBeGreaterThan(0);

  const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
  fireEvent.click(deleteButtons[deleteButtons.length - 1]);

  await waitFor(() => {
    expect(screen.queryByText(/projeto caixa editado/i)).not.toBeInTheDocument();
  });
});

test('opens project page and creates expense with category', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }));

  expect((await screen.findAllByText(/controle financeiro interno/i)).length).toBeGreaterThan(0);

  fireEvent.click(screen.getAllByRole('button', { name: /^entrar$/i }).at(-1));

  expect(screen.getByText(/pagina do projeto/i)).toBeInTheDocument();
  expect(screen.getByText(/^saldo$/i)).toBeInTheDocument();
  expect(screen.getByText(/grafico de despesas/i)).toBeInTheDocument();
  expect(screen.getByText(/3 maiores valores/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/^descricao$/i), {
    target: { value: 'Compra de licenca' },
  });
  fireEvent.change(screen.getByLabelText(/categoria/i), {
    target: { value: 'Software' },
  });
  fireEvent.change(screen.getByLabelText(/valor/i), {
    target: { value: '1200' },
  });

  fireEvent.click(screen.getByRole('button', { name: /cadastrar despesa/i }));

  expect((await screen.findAllByText(/compra de licenca/i)).length).toBeGreaterThan(0);
  expect(screen.getByLabelText(/grafico de pizza das despesas/i)).toBeInTheDocument();
});
