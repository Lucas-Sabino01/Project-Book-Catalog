/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { username?: string; password?: string }) => Promise<void>;
  user: User | null;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface DecodedToken extends User {
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialUser = (): User | null => {
  const token = localStorage.getItem('vibe-token');
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    // Verifica se o token expirou
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('vibe-token');
      return null;
    }
    return { id: decoded.id, username: decoded.username, role: decoded.role };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [user, setUser] = useState<User | null>(getInitialUser());

  const login = async (username: string, password: string) => {
    try {
      const { token } = await authService.login(username, password);
      const decodedUser: User = jwtDecode(token);
      setIsAuthenticated(true);
      setUser(decodedUser);
    } catch (error: unknown) {
      const message = (error as ApiError)?.response?.data?.message || "Erro ao realizar login";
      throw new Error(message);
    }
  };

  const register = async (username: string, password: string, role: string) => {
    try {
      await authService.register(username, password, role);
      // Não faz login automático, apenas registra. O usuário será redirecionado para a página de login.
    } catch (error: unknown) {
      const message = (error as ApiError)?.response?.data?.message || "Erro ao criar conta"; // Assuming message is a string
      throw new Error(message);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateProfile = async (data: { username?: string; password?: string }) => {
    if (!user) throw new Error("Usuário não autenticado.");

    try {
      const { token: newToken } = await authService.updateUserProfile(user.id, data);
      localStorage.setItem('vibe-token', newToken);
      const decodedUser: User = jwtDecode(newToken);
      setUser(decodedUser);
    } catch (error: unknown) {
      const message = (error as ApiError)?.response?.data?.message || "Erro ao atualizar perfil";
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, user, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};