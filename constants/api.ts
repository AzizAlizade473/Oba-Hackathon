// constants/api.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://16.171.0.209:3000/api/v1';

export interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

export interface ApiResponse {
  [key: string]: unknown;
}

export const api = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('oba_token');
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem('oba_token', token);
  },

  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem('oba_token');
    await AsyncStorage.removeItem('oba_user');
  },

  async request(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      const data = await response.json() as ApiResponse;
      if (!response.ok) throw new Error((data.message as string) || 'Request failed');
      return data;
    } catch (error: unknown) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async login(phone: string, password: string): Promise<ApiResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    const token = (response.token || response.access_token) as string | undefined;
    if (token) {
      await this.setToken(token);
      await AsyncStorage.setItem('oba_user', JSON.stringify(response.user));
    }
    return response;
  },

  async register(userData: Record<string, string>): Promise<ApiResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const token = (response.token || response.access_token) as string | undefined;
    if (token) {
      await this.setToken(token);
      await AsyncStorage.setItem('oba_user', JSON.stringify(response.user));
    }
    return response;
  },

  async getUserProfile(): Promise<ApiResponse> {
    return this.request('/users/me');
  },

  async getTopProducts(): Promise<ApiResponse> {
    return this.request('/products/top');
  },

  async getProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`);
  },

  async getUserOrders(params: { page: number; limit: number; startDate?: string; endDate?: string }): Promise<ApiResponse> {
    let query = `/orders/my-orders?page=${params.page}&limit=${params.limit}`;
    if (params.startDate) query += `&startDate=${params.startDate}`;
    if (params.endDate) query += `&endDate=${params.endDate}`;
    return this.request(query);
  },

  async submitRating(productId: string, score: number, comment: string, reason?: string): Promise<ApiResponse> {
    const body: Record<string, unknown> = { productId, score, comment };
    if (reason) body.reason = reason;
    return this.request('/ratings', { method: 'POST', body: JSON.stringify(body) });
  },

  async updateRating(ratingId: string, score: number, comment: string, reason?: string): Promise<ApiResponse> {
    const body: Record<string, unknown> = { score, comment };
    if (reason) body.reason = reason;
    return this.request(`/ratings/${ratingId}`, { method: 'PUT', body: JSON.stringify(body) });
  },
};
