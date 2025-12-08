/**
 * Axios instance configuration
 */

import axios from 'axios';
import { getErrorMessage, isNetworkError } from '@/utils/errorHandler';
import type { ApiError } from '@/types';

const apiClient = axios.create({
  baseURL: '/api', // Use the proxy defined in vite.config.ts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle API errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;
    const apiError: ApiError = {
      success: false,
      message: isNetworkError(error) ? 'Erro de conexão com o servidor.' : getErrorMessage(responseData),
      statusCode: error.response?.status,
      error: responseData?.error || 'Erro não especificado.',
      timestamp: responseData?.timestamp || new Date().toISOString(),
    };
    return Promise.reject(apiError);
  }
);

export default apiClient;