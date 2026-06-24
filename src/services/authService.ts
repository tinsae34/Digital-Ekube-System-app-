import { api, setApiToken } from './api';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: string;
  otp_placeholder?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (phone: string, password?: string, otp?: string): Promise<AuthResponse> => {
    try {
      // Call the Flask backend login endpoint
      const response = await api.post('/api/auth/login', { phone, password, otp });
      
      const token = response.token;
      const user = response.user;

      setApiToken(token);
      return { user, token };
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  register: async (phone: string, password: string, name: string, role: string = 'user'): Promise<AuthResponse> => {
    try {
      // Call the Flask backend register endpoint
      const response = await api.post('/api/auth/register', { phone, password, name, role });
      
      const token = response.token;
      const user = response.user;

      setApiToken(token);
      return { user, token };
    } catch (error) {
      console.error('Register service error:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const user = await api.get('/api/users/me');
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    setApiToken(null);
  }
};
