import { api, setApiToken } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Call the Flask backend login endpoint
      const response = await api.post('/api/auth/login', { email, password });
      
      // If the backend returns a real token, use it.
      // Otherwise, since the backend routes are placeholders, we create a mock token for the frontend flow to succeed.
      const token = response.token || 'mock-jwt-token-xyz123';
      const user = response.user || {
        id: '1',
        email: email,
        name: email.split('@')[0].toUpperCase(),
      };

      setApiToken(token);
      return { user, token };
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      // Call the Flask backend register endpoint
      const response = await api.post('/api/auth/register', { email, password, name });
      
      const token = response.token || 'mock-jwt-token-xyz123';
      const user = response.user || {
        id: '1',
        email: email,
        name: name || email.split('@')[0].toUpperCase(),
      };

      setApiToken(token);
      return { user, token };
    } catch (error) {
      console.error('Register service error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    setApiToken(null);
  }
};
