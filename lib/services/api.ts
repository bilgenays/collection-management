import axios from 'axios';
import { AuthResponse, GetProductsResponse, GetProductsRequest, GetAllCollectionsResponse, LoginRequest } from '../types/api';
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  
  if (session?.user?.accessToken) {
    config.headers.set('Authorization', `Bearer ${session.user.accessToken}`);
    config.headers.set('Accept', 'application/json');
    config.headers.set('Content-Type', 'application/json');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      const session = await getSession();
      if (!session?.user?.accessToken) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post<AuthResponse>('/Auth/Login', credentials);
    return response.data;
  },


  refreshToken: async (refreshToken: string) => {
    const response = await api.post<AuthResponse>('/Auth/RefreshTokenLogin', {
      refreshToken,
    });
    return response.data;
  },
};

export const collectionsService = {
  getAll: async () => {
    const response = await api.get<GetAllCollectionsResponse>('/Collection/GetAll');
    return response.data;
  },

  getFilters: async (collectionId: number) => {
    const response = await api.get(`/Collection/${collectionId}/GetFiltersForConstants`);
    return response.data;
  },

  getProducts: async (collectionId: number, request: GetProductsRequest) => {
    const response = await api.post<GetProductsResponse>(
      `/Collection/${collectionId}/GetProductsForConstants`,
      request
    );
    return response.data;
  },
};