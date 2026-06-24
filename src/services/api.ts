import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Resolve local API URL depending on the platform
// - Extracts host machine's LAN IP when connected to Metro Bundler (e.g., physical devices on same Wi-Fi)
// - Defaults to localhost/10.0.2.2 for local development on simulator/emulator
const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();

let userToken: string | null = null;

export const setApiToken = (token: string | null) => {
  userToken = token;
};

interface RequestOptions extends RequestInit {
  body?: any;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  headers.append('Content-Type', 'application/json');

  if (userToken) {
    headers.append('Authorization', `Bearer ${userToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API Request Error [${config.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint: string, options?: RequestOptions) =>
    request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, body: any, options?: RequestOptions) =>
    request(endpoint, { ...options, method: 'POST', body }),

  put: (endpoint: string, body: any, options?: RequestOptions) =>
    request(endpoint, { ...options, method: 'PUT', body }),

  delete: (endpoint: string, options?: RequestOptions) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};
