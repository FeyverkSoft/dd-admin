
import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple';
import { alerts } from '../_reducers/alert/alert.reducer';
import { auth } from '../_reducers/auth/auth.reducer';
import { AlertState } from '../_reducers/alert/AlertState';

const config = { namespace: "DDA_V1_store" }
const middleware = [reduxLogger, thunk, save(config)];

export const store = configureStore({
    reducer: { alerts, auth },
    middleware: middleware,
    preloadedState: load(config),
    devTools: true || process.env.NODE_ENV !== 'production',
})

export interface IStore {
    alerts: AlertState,
    auth: { isAuth: boolean },
}