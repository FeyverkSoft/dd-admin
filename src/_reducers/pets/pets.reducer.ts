import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { api, Config } from '../../core';
import { BaseResponse } from '../../_services/entity';
import { IPet, PetGender, PetSearchResult, PetState, PetType } from './IPet';

const count = 15;//количество отображаемых сообщений петов по дефолту

export const fetchPets = createAsyncThunk(
    'pets/fetch',
    async (params: {
        organisationId: string,
        limit: number,
        offset: number,
        petStatuses?: Array<PetState> | undefined,
        petGenders?: Array<PetGender> | undefined,
        text?: string,
        types?: Array<PetType> | undefined,
    }, { signal }) => {
        const source = axios.CancelToken.source()
        signal.addEventListener('abort', () => {
            source.cancel()
        })
        const response = await api.get<BaseResponse & PetSearchResult>(Config.BuildUrl("/admin/pets"),
            {
                params: {
                    organisationId: params.organisationId,
                    limit: params.limit ?? count,
                    offset: params.offset ?? 0,
                    petStatuses: params.petStatuses,
                    genders: params.petGenders,
                    text: params.text,
                    types: params.types,
                },
                paramsSerializer: {
                    indexes: true,
                },
                cancelToken: source.token,
            })
        return response.data
    }
)

export const changeStatus = createAsyncThunk(
    'pets/update/status',
    async (params: {
        id: string,
        value: PetState
    }, { signal }) => {
        const source = axios.CancelToken.source()
        signal.addEventListener('abort', () => {
            source.cancel()
        })
        const response = await api.patch<BaseResponse & IPet>(Config.BuildUrl(`/admin/pets/${params.id}/state`),
            {
                state: params.value,
            },
            {

                cancelToken: source.token,
            })
        return response.data
    }
)

export const changeGender = createAsyncThunk(
    'pets/update/gender',
    async (params: {
        id: string,
        value: PetGender
    }, { signal }) => {
        const source = axios.CancelToken.source()
        signal.addEventListener('abort', () => {
            source.cancel()
        })
        const response = await api.patch<BaseResponse & IPet>(Config.BuildUrl(`/admin/pets/${params.id}/gender`),
            {
                gender: params.value,
            },
            {
                cancelToken: source.token,
            },
        )
        return response.data
    }
)

export const changeType = createAsyncThunk(
    'pets/update/type',
    async (params: {
        id: string,
        value: PetType
    }, { signal }) => {
        const source = axios.CancelToken.source()
        signal.addEventListener('abort', () => {
            source.cancel()
        })
        const response = await api.patch<BaseResponse & IPet>(Config.BuildUrl(`/admin/pets/${params.id}/type`),
            {
                type: params.value,
            },
            {

                cancelToken: source.token,
            })
        return response.data
    }
)

const initialState: PetSearchResult = {
    isLoading: false,
    total: 0,
    limit: count,
    offset: 0,
    items: []
};
const { actions, reducer } = createSlice({
    name: 'pets',
    initialState,
    reducers: {
        // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPets.pending, (state, action) => {
                state.isLoading = true;
                return state;
            })
            .addCase(fetchPets.fulfilled, (state, action) => {
                state = action.payload;
                state.isLoading = false;
                return state;
            })

            .addCase(changeStatus.pending, (state, action) => {
                state.isLoading = true;
                return state;
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.items.filter(_ => _.id === action.payload.id)[0].petState = action.payload.petState;
                state.isLoading = false;
                return state;
            })

            .addCase(changeType.pending, (state, action) => {
                state.isLoading = true;
                return state;
            })
            .addCase(changeType.fulfilled, (state, action) => {
                state.items.filter(_ => _.id === action.payload.id)[0].type = action.payload.type;
                state.isLoading = false;
                return state;
            })

            .addCase(changeGender.pending, (state, action) => {
                state.isLoading = true;
                return state;
            })
            .addCase(changeGender.fulfilled, (state, action) => {
                state.items.filter(_ => _.id === action.payload.id)[0].gender = action.payload.gender;
                state.isLoading = false;
                return state;
            })
    },
})

export const { } = actions;

export { reducer as pets };