import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllDistrictsFilter, getDistrictById } from './districtAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface DistrictState {
  status: 'idle' | 'loading' | 'failed';
  districtList: Array<KeyValue>;
}

const initialState: DistrictState = {
  status: 'idle',
  districtList: [],
};

export const getDistrictInfo = createAsyncThunk(
  'district/getInfo',
  async (data: KeyValue) => {
    return await getDistrictById(data);
  },
);

export const getDistrictListFilter = createAsyncThunk(
  'district/getListFilter',
  async (data: KeyValue) => {
    return await getAllDistrictsFilter(data);
  },
);

export const DistrictSlice = createSlice({
  name: 'district',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDistrictInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDistrictInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getDistrictListFilter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDistrictListFilter.fulfilled, (state, action) => {
        state.status = 'idle';
        state.districtList = action.payload.data?.list;
      });
  },
});

export const {} = DistrictSlice.actions;

export default DistrictSlice.reducer;

export const districtList = (state: AppState) => state.district.districtList;
export const districtLoading = (state: AppState) => state.district.status;
