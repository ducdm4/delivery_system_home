import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllWardsFilter, getWardById } from './wardAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface WardState {
  status: 'idle' | 'loading' | 'failed';
  currentWardList: Array<KeyValue>;
}

const initialState: WardState = {
  status: 'idle',
  currentWardList: [],
};

export const getWardInfo = createAsyncThunk(
  'ward/getInfo',
  async (data: KeyValue) => {
    return await getWardById(data);
  },
);

export const getWardListFilter = createAsyncThunk(
  'ward/getListFilter',
  async (data: KeyValue) => {
    return await getAllWardsFilter(data);
  },
);

export const WardSlice = createSlice({
  name: 'ward',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWardInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getWardInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getWardListFilter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getWardListFilter.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload.isSuccess) {
          state.currentWardList = action.payload.data.list;
        }
      });
  },
});

export const {} = WardSlice.actions;

export default WardSlice.reducer;

export const wardLoading = (state: AppState) => state.ward.status;
export const currentWardList = (state: AppState) => state.ward.currentWardList;
