import axios from 'axios';
import config from '../config';

const axiosInstance = axios.create({
  baseURL: `${config.apiBaseUrl}/`,
  timeout: 30000,
});

export default axiosInstance;