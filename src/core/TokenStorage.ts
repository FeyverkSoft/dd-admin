import { AxiosRequestConfig } from "axios";
import axios from 'axios';
import { IJwtBody } from "../_services/auth/JwtBody";
import { Config } from ".";
import { store } from "../_helpers";
import { authClear, authCreate } from "../_reducers/auth/auth.reducer";

export class TokenStorage {

  private static readonly LOCAL_STORAGE_TOKEN = 'token';
  private static readonly LOCAL_STORAGE_REFRESH_TOKEN = 'refresh_token';

  public static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  public static getNewToken(): Promise<string> {
    const requestOptions: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'accept': 'multipart/form-data'
      },
    };
    const data = new FormData();
    data.append("refresh_token", this.getRefreshToken() || '');
    data.append("grant_type", 'refresh_token');
    return new Promise((resolve, reject) => {
      axios
        .post<IJwtBody>(Config.BuildUrl('/oauth2/token'), data, requestOptions)
        .then(response => {
          this.storeToken(response.data.access_token);
          this.storeRefreshToken(response.data.refresh_token);

          resolve(response.data.access_token);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public static storeToken(token: string): void {
    localStorage.setItem(TokenStorage.LOCAL_STORAGE_TOKEN, token);
    store.dispatch(authCreate());
  }

  public static storeRefreshToken(refreshToken: string): void {
    localStorage.setItem(TokenStorage.LOCAL_STORAGE_REFRESH_TOKEN, refreshToken);
  }

  public static clear(): void {
    localStorage.removeItem(TokenStorage.LOCAL_STORAGE_TOKEN);
    localStorage.removeItem(TokenStorage.LOCAL_STORAGE_REFRESH_TOKEN);
    store.dispatch(authClear());
  }

  private static getRefreshToken(): string | null {
    return localStorage.getItem(TokenStorage.LOCAL_STORAGE_REFRESH_TOKEN);
  }

  public static getToken(): string | null {
    return localStorage.getItem(TokenStorage.LOCAL_STORAGE_TOKEN);
  }
}