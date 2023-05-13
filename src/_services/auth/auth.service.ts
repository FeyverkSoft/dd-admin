import axios, { AxiosRequestConfig } from 'axios';
import { TokenStorage } from '../../core/TokenStorage';
import { Config } from '../../core';
import { IJwtBody } from './JwtBody';
import { history } from '../../_helpers/history';
import { createErrorAlert } from '../../_reducers/alert/alert.reducer';
import { store } from '../../_helpers/store';
import { Alert } from '../entity';

export class authService {
    static async logIn(username: string, password: string): Promise<void> {
        const requestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'accept': 'multipart/form-data'
            },
        };
        const data = new FormData();
        data.append("username", username);
        data.append("password", password);
        data.append("grant_type", 'password');
        await axios.post<IJwtBody>(Config.BuildUrl('/oauth2/token'), data, requestOptions)
            .then(async _ => {
                TokenStorage.storeRefreshToken(_.data.refresh_token);
                TokenStorage.storeToken(_.data.access_token);
                history.push('/');
            }).catch(async (ex) => {
                await store.dispatch(createErrorAlert(new Alert(ex.messages, "error")));
            });
    };

    static async logOut(): Promise<any> {
        TokenStorage.clear();
        history.push('/');
    };
}
