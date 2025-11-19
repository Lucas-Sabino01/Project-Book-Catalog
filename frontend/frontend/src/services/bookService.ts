import api from './api';

export interface Book {
  id?: number;
  title: string;
  author: string;
  genre?: string;
  pages: number;
  publication_year: number;
}

export interface DashboardStats {
  totalBooks: number;
  totalAuthors: number;
  totalGenres: number;
}

export interface AuthorStats {
  author: string;
  bookCount: number;
}

type BookFormData = { titulo: string, autor: string, genero: string, pages: number, ano_publicacao: number };

const mapBookDataToPayload = (bookData: Partial<BookFormData>) => ({
  title: bookData.titulo,
  author: bookData.autor,
  genre: bookData.genero,
  pages: bookData.pages,
  publication_year: bookData.ano_publicacao,
});

export const bookService = {
  getDashboardStats: async () => {
    const response = await api.get<DashboardStats>('/livros/stats');
    return response.data;
  },

  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get('/livros');
    return response.data;
  },

  createBook: async (bookData: BookFormData): Promise<Book> => {
    const payload = mapBookDataToPayload(bookData);
    const response = await api.post('/livros', payload);
    return response.data;
  },

  updateBook: async (id: number, bookData: Partial<BookFormData>): Promise<{ message: string }> => {
    const payload = mapBookDataToPayload(bookData);
    const response = await api.put(`/livros/${id}`, payload);
    return response.data;
  },

  deleteBook: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/livros/${id}`);
    return response.data;
  },

  getAuthors: async (): Promise<AuthorStats[]> => {
    const response = await api.get('/livros/autores');
    return response.data;
  },
};