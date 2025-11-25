import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import DashboardHome from '../DashboardHome';
import { bookService } from '../../services/bookService';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../services/bookService', () => ({
  bookService: {
    getAllBooks: vi.fn(),
    getDashboardStats: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockBooks = [
  { id: 1, title: 'Livro 1', author: 'Autor A', pages: 100, userOwnerId: 1 },
  { id: 2, title: 'Livro 2', author: 'Autor B', pages: 200, userOwnerId: 1 },
];

describe('DashboardHome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar as estatísticas corretas baseadas nos livros', async () => {
    (bookService.getAllBooks as Mock).mockResolvedValue(mockBooks);
    (bookService.getDashboardStats as Mock).mockResolvedValue({
      totalBooks: 2,
      totalAuthors: 2,
      totalGenres: 5,
    });

    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>
    );

    await waitFor(() => {
      const elements = screen.getAllByText('2');
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it('deve renderizar a lista de atividades recentes', async () => {
    (bookService.getAllBooks as Mock).mockResolvedValue(mockBooks);
    (bookService.getDashboardStats as Mock).mockResolvedValue({
      totalBooks: 2,
      totalAuthors: 2,
      totalGenres: 5,
    });

    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1984')).toBeInTheDocument();
      expect(screen.getByText('por George Orwell')).toBeInTheDocument();
    });
  });
});