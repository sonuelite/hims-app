import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiUrl = 'https://hims-api.zynotechnologies.com';

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['x-entity-id'] = '1';

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;