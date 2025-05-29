import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Android emulator, localhost won't work, we need to use 10.0.2.2
const BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: number;
  title: string;
  frequency: 'daily' | 'weekly';
  isCompleted: boolean;
  last_tracked: string | null;
}

export interface CreateHabitParams {
  title: string;
  frequency: 'daily' | 'weekly';
}

export const authApi = {
  register: async (username: string, password: string) => {
    const response = await api.post('/auth/register', { username, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
  }
};

export const habitsApi = {
  getHabits: async (): Promise<Habit[]> => {
    const response = await api.get('/habits');
    return response.data;
  },

  createHabit: async (params: CreateHabitParams): Promise<Habit> => {
    const response = await api.post('/habits', params);
    return response.data;
  },

  updateHabit: async (id: number, title: string, frequency: string): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, { title, frequency });
    return response.data;
  },

  trackHabit: async (id: number): Promise<Habit> => {
    const response = await api.post(`/habits/${id}/toggle`);
    return response.data;
  }
}; 