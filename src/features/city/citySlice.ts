import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllCitiesFilter, getCityById } from './cityAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface CityState {
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CityState = {
  status: 'idle',
};

export const getCityInfo = createAsyncThunk(
  'city/getInfo',
  async (data: KeyValue) => {
    return await getCityById(data);
  },
);

export const getCityListFilter = createAsyncThunk(
  'city/getListFilter',
  async (data: KeyValue) => {
    return await getAllCitiesFilter(data);
  },
);

export const CitySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCityInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCityInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getCityListFilter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCityListFilter.fulfilled, (state, action) => {
        state.status = 'idle';
      });
  },
});

export const {} = CitySlice.actions;

export default CitySlice.reducer;

export const cityLoading = (state: AppState) => state.city.status;
