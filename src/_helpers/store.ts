
import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple';

const config = { namespace: "DDA_V1_store" }
const middleware = [reduxLogger, thunk, save(config)];

export const store = configureStore({
    reducer: {
    },
    middleware: middleware,
    preloadedState: load(config),
    devTools: process.env.NODE_ENV !== 'production',
})