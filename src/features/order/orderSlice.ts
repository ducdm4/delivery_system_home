import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrderApi, getQuoteAPI } from './orderAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface OrderState {
  status: 'idle' | 'loading' | 'failed';
}

const initialState: OrderState = {
  status: 'idle',
};

export const getQuoteInfo = createAsyncThunk(
  'order/getQuote',
  async (data: KeyValue) => {
    return await getQuoteAPI(data);
  },
);

export const createNewOrder = createAsyncThunk(
  'order/new',
  async (data: KeyValue) => {
    return await createOrderApi(data);
  },
);

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuoteInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getQuoteInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.status = 'idle';
      });
  },
});

export const {} = OrderSlice.actions;

export default OrderSlice.reducer;

export const orderLoading = (state: AppState) => state.order.status;
