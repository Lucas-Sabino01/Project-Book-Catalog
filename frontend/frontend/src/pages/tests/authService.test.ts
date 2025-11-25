import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/authService';
import api from '../../services/api';

// Mock do Axios (api)
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve fazer login com sucesso e salvar o token', async () => {
    const mockResponse = {
      data: {
        message: 'Login sucesso',
        token: 'fake-jwt-token',
      },
    };

    // Ensina o mock a retornar sucesso quando api.post for chamado
    (api.post as any).mockResolvedValueOnce(mockResponse);

    const result = await authService.login('admin', '123456');

    // Verifica se chamou a URL certa com os dados certos
    expect(api.post).toHaveBeenCalledWith('/user/auth/login', {
      username: 'admin',
      password: '123456',
    });

    // Verifica se salvou no localStorage
    expect(localStorage.getItem('vibe-token')).toBe('fake-jwt-token');
    expect(result).toEqual(mockResponse.data);
  });

  it('deve verificar se está autenticado corretamente', () => {
    expect(authService.isAuthenticated()).toBe(false);

    localStorage.setItem('vibe-token', 'token-existente');
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('deve fazer logout (remover token)', () => {
    localStorage.setItem('vibe-token', 'token-para-remover');
    authService.logout();
    expect(localStorage.getItem('vibe-token')).toBeNull();
  });
});