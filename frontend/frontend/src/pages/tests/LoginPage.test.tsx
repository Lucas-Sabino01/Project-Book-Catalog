import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../LoginPage';
import { AuthProvider } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { authService } from '../../services/authService';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    isAuthenticated: vi.fn().mockReturnValue(false),
  },
}));

vi.mock('../../components/3d/BookIcon', () => ({
  default: () => <div data-testid="book-icon">Icone 3D</div>
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve chamar a função de login quando o formulário for válido', async () => {
    (authService.login as any).mockResolvedValue({ token: '123' });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const userInput = screen.getByLabelText(/usuário/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(userInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('admin', '123456');
    });
  });
});