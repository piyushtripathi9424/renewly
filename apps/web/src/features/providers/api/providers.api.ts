import axios from 'axios';
import { Provider, PaginatedProviders } from '../types';

const api = axios.create({
  baseURL: '/api/providers',
});

// Adding token intercepter if needed, assuming token is stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProviders = async (params: Record<string, unknown>): Promise<PaginatedProviders> => {
  const { data } = await api.get('', { params });
  return data;
};

export const getProvider = async (id: string): Promise<Provider> => {
  const { data } = await api.get(`/${id}`);
  return data;
};

export const createProvider = async (provider: Partial<Provider>): Promise<Provider> => {
  const { data } = await api.post('', provider);
  return data;
};

export const updateProvider = async (id: string, provider: Partial<Provider>): Promise<Provider> => {
  const { data } = await api.patch(`/${id}`, provider);
  return data;
};

export const deleteProvider = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};
