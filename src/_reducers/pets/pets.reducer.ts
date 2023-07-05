import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { Config } from '../../core';
import { BaseResponse } from '../../_services/entity';
import { PetGender, PetSearchResult, PetState } from './IPet';

const count = 15;//количество отображаемых сообщений петов по дефолту

const fetchPets = createAsyncThunk(
    'pets/fetch',
    async (params: {
        organisationId: string,
        limit: number,
        offset: number,
        petStatuses: Array<PetState> | undefined,
        petGenders?: Array<PetGender> | undefined
    }, { signal }) => {
        const source = axios.CancelToken.source()
        signal.addEventListener('abort', () => {
            source.cancel()
        })
        const response = await axios.get<BaseResponse & PetSearchResult>(Config.BuildUrl("/api/pets"),
            {
                params: {
                    organisationId: params.organisationId,
                    limit: params.limit ?? count,
                    offset: params.offset ?? 0,
                    petStatuses: params.petStatuses,
                    genders: params.petGenders,
                },
                cancelToken: source.token,
            })
        return response.data
    }
)
const initialState: PetSearchResult = {
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
        builder.addCase(fetchPets.fulfilled, (state, action) => {
            state = action.payload
        })
    },
})

export const { } = actions;

export { reducer as pets };