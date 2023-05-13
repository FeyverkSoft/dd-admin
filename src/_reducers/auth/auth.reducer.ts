import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
    name: 'auth',
    initialState: { isAuth: false },
    reducers: {
        authCreate: (state) => {
            state.isAuth = true;
            return state;
        },
        authClear: (state) => {
            state.isAuth = false;
            return state;
        },
    }
});

export const { authCreate, authClear } = actions;

export { reducer as auth };