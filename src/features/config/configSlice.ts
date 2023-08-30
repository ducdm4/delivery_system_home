import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllConfig } from './configAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface ConfigState {
  status: 'idle' | 'loading' | 'failed';
  generalConfig: {
    baseRate: number;
    weightLevel: number;
    ward: number;
    district: number;
  };
}

const initialState: ConfigState = {
  status: 'idle',
  generalConfig: {
    baseRate: 10000,
    weightLevel: 3000,
    ward: 4000,
    district: 6000,
  },
};

export const getAllConfigInfo = createAsyncThunk('config/getAll', async () => {
  return await getAllConfig();
});

export const ConfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllConfigInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllConfigInfo.fulfilled, (state, action) => {
        state.status = 'idle';
        state.generalConfig = action.payload.data;
      });
  },
});

export const {} = ConfigSlice.actions;

export default ConfigSlice.reducer;

export const configLoading = (state: AppState) => state.config.status;
export const generalConfig = (state: AppState) => state.config.generalConfig;
