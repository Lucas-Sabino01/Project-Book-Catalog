import api from './api';

export interface User {
  id: number;
  username: string;
  role: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

interface RegisterResponse {
  message: string;
}

interface UpdateUserResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post<LoginResponse>('/user/auth/login', {
      username,
      password,
    });
    
    const { token } = response.data;
    if (token) {
      localStorage.setItem('vibe-token', token);
    }
    
    return response.data;
  },

  register: async (username: string, password: string, role: string) => {
    const response = await api.post<RegisterResponse>('/user/auth', {
      username,
      password,
      role,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('vibe-token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('vibe-token');
  },

  getAllUsers: async () => {
    const response = await api.get<User[]>('/user');
    return response.data;
  },

  updateUserRole: async (userId: number, role: string) => {
    const response = await api.put<User>(`/user/${userId}`, { role });
    return response.data;
  },

  updateUserProfile: async (userId: number, data: { username?: string; password?: string }) => {
    const response = await api.put<UpdateUserResponse>(`/user/${userId}`, data);
    return response.data;
  },
};