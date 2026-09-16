import axios from 'axios';
import { store } from '../store/store';

export const apiUrl = 'https://hims-api.zynotechnologies.com';

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers.delete('Authorization');
    }

    config.headers['x-entity-id'] = '1';

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
