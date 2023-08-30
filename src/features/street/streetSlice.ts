import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllStreetsFilter, getStreetById } from './streetAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface StreetState {
  status: 'idle' | 'loading' | 'failed';
  streetList: Array<KeyValue>;
}

const initialState: StreetState = {
  status: 'idle',
  streetList: [],
};

export const getStreetInfo = createAsyncThunk(
  'street/getInfo',
  async (data: KeyValue) => {
    return await getStreetById(data);
  },
);

export const getStreetListFilter = createAsyncThunk(
  'street/getListFilter',
  async (data: KeyValue) => {
    return await getAllStreetsFilter(data);
  },
);

export const StreetSlice = createSlice({
  name: 'street',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStreetInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStreetInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getStreetListFilter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStreetListFilter.fulfilled, (state, action) => {
        state.status = 'idle';
        state.streetList = action.payload.data?.list;
      });
  },
});

export const {} = StreetSlice.actions;

export default StreetSlice.reducer;

export const streetListStore = (state: AppState) => state.street.streetList;
export const streetLoading = (state: AppState) => state.street.status;
