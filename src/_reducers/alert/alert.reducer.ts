import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert } from '../../_services/entity';
import { AlertState } from './';

const count = 5;//количество отображаемых сообщений

const { actions, reducer } = createSlice({
    name: 'alerts',
    initialState: new AlertState(),
    reducers: {
        createSuccessAlert: (state, action: PayloadAction<Alert>) => {
            state.messages = [action.payload, ...state.messages].slice(0, count);
            return state;
        },
        createErrorAlert: (state, action: PayloadAction<Alert>) => {
            state.messages = [action.payload, ...state.messages].slice(0, count);
            return state;
        },
        createInfoAlert: (state, action: PayloadAction<Alert>) => {
            state.messages = [action.payload, ...state.messages].slice(0, count);
            return state;
        },
        deleteAlert: (state, action: PayloadAction<Required<string>>) => {
            state.messages = state.messages.filter(x => x.id !== action.payload);
            return state;
        },
        clearAlert: (state, action) => {
            return new AlertState();
        },
    }
});

export const { createSuccessAlert, createErrorAlert, createInfoAlert, deleteAlert, clearAlert } = actions;

export { reducer as alerts };