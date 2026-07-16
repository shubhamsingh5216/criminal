import axios from 'axios';
import { ApiResponse, CriminalRecord, MatchResult } from '../types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('The request timed out. Please try again.'));
    }
    if (error.response) {
      return Promise.reject(error.response.data?.error || error.message);
    }
    return Promise.reject(new Error('Unable to connect to the server.'));
  }
);

export const addCriminal = async (formData: FormData) => {
  const response = await api.post<CriminalRecord>('/criminals/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchCriminals = async () => {
  const response = await api.get<CriminalRecord[]>('/criminals/');
  return response.data;
};

export const matchCriminal = async (formData: FormData) => {
  const response = await api.post<MatchResult>('/check-face/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default api;
