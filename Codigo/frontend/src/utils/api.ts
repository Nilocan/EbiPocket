import axios from 'axios';

export const unauthedClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const authedClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

authedClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token)
    config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : '';

  return config;
});
