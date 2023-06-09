import axios from 'axios';
import { TokenStorage } from './TokenStorage';

export const api = axios.create();


api.interceptors.request.use((config: any): any => {
  config.headers['Authorization'] = `Bearer ${TokenStorage.getToken()}`;
  return config;
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status !== 401) {
    return new Promise((resolve, reject) => {
      if (error.response.data)
        reject(error.response.data.detail || error.response.data.error_description);
      else
        reject(error.response);
    });
  }

  if (error.config.url === '/oauth2/token') {
    TokenStorage.clear();
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
  return TokenStorage.getNewToken()
    .then((token: any) => {
      const config = error.config;
      config.headers['Authorization'] = `Bearer ${token}`;

      return new Promise((resolve, reject) => {
        axios.request(config).then(response => {
          resolve(response);
        }).catch((error) => {
          console.log(error);
          TokenStorage.clear();
        })
      });

    })
    .catch((error: any) => {
      TokenStorage.clear();
      console.log(error);
    });
});