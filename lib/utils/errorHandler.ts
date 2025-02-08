import { ApiError } from '../types/api';

export const getErrorMessage = (error: { response?: { data: ApiError }, request?: unknown, message?: string }): string => {
  if (error.response) {
    const apiError: ApiError = error.response.data;
    return apiError.message || 'Bir hata oluştu.';

  } else if (error.request) {
    return 'Sunucuya ulaşılamadı.';
  } else {
    return error.message || 'Bir hata oluştu.';
  }
};