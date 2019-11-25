import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

const defaultOptions = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const instance = axios.create(defaultOptions);

const token = localStorage.getItem('access_token');
instance.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';

export default instance;
