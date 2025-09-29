import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const getDashboardStats = () => api.get('/api/dashboard/stats');
export const getRecentActivity = () => api.get('/api/dashboard/activity');
export const getActiveUploads = () => api.get('/api/dashboard/uploads');

// Accounts API
export const getAccounts = (params: any) => api.get('/api/accounts', { params });
export const getAccount = (id: number) => api.get(`/api/accounts/${id}`);
export const createAccount = (data: any) => api.post('/api/accounts', data);
export const updateAccount = (data: any) => api.put(`/api/accounts/${data.id}`, data);
export const deleteAccount = (id: number) => api.delete(`/api/accounts/${id}`);
export const verifyAccount = (data: any) => api.post(`/api/accounts/${data.accountId}/verify`, { phone_number: data.phoneNumber });
export const startWarming = (id: number) => api.post(`/api/accounts/${id}/warm-up`);
export const changePassword = (data: any) => api.post(`/api/accounts/${data.accountId}/change-password`, { new_password: data.newPassword });
export const getAccountLogs = (id: number, params: any) => api.get(`/api/accounts/${id}/logs`, { params });
export const bulkImportAccounts = (data: any) => api.post('/api/accounts/bulk-import', data);

// Videos API
export const getVideos = (params: any) => api.get('/api/videos', { params });
export const getVideo = (id: number) => api.get(`/api/videos/${id}`);
export const uploadVideo = (formData: FormData) => api.post('/api/videos/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateVideo = (data: any) => api.put(`/api/videos/${data.id}`, data);
export const deleteVideo = (id: number) => api.delete(`/api/videos/${id}`);
export const retryUpload = (id: number) => api.post(`/api/videos/${id}/retry-upload`);
export const publishVideo = (id: number) => api.post(`/api/videos/${id}/publish`);
export const getUploadStatus = (id: number) => api.get(`/api/videos/${id}/status`);
export const bulkUploadVideos = (formData: FormData) => api.post('/api/videos/bulk-upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Proxies API
export const getProxies = (params: any) => api.get('/api/proxies', { params });
export const getProxy = (id: number) => api.get(`/api/proxies/${id}`);
export const createProxy = (data: any) => api.post('/api/proxies', data);
export const updateProxy = (data: any) => api.put(`/api/proxies/${data.id}`, data);
export const deleteProxy = (id: number) => api.delete(`/api/proxies/${id}`);
export const testProxy = (id: number) => api.post(`/api/proxies/${id}/test`);
export const testAllProxies = () => api.post('/api/proxies/test-all');
export const getProxyStats = () => api.get('/api/proxies/stats');

// Telegram API
export const getTelegramSettings = () => api.get('/api/telegram/settings');
export const updateTelegramSettings = (data: any) => api.put('/api/telegram/settings', data);
export const sendTestMessage = (data: any) => api.post('/api/telegram/send-test', data);
export const getNotifications = (params: any) => api.get('/api/telegram/notifications', { params });

// Captcha API
export const getCaptchaSettings = () => api.get('/api/captcha/settings');
export const updateCaptchaSettings = (data: any) => api.put('/api/captcha/settings', data);
export const getCaptchaBalance = () => api.get('/api/captcha/balance');
export const solveCaptcha = (data: any) => api.post('/api/captcha/solve', data);

// Settings API
export const getSettings = () => api.get('/api/settings');
export const updateSettings = (data: any) => api.put('/api/settings', data);

// Health check
export const healthCheck = () => api.get('/api/health');

export default api;
