import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createOrderApi,
  customerConfirmCancelAPI,
  customerRequestCancelAPI,
  getOrderTrackingAPI,
  getQuoteAPI,
} from './orderAPI';
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

export const trackingOrder = createAsyncThunk(
  'order/track',
  async (data: string) => {
    return await getOrderTrackingAPI(data);
  },
);

export const customerRequestCancel = createAsyncThunk(
  'order/customerRequestCancel',
  async (data: string) => {
    return await customerRequestCancelAPI(data);
  },
);

export const customerConfirmCancel = createAsyncThunk(
  'order/customerConfirmCancel',
  async (data: KeyValue) => {
    return await customerConfirmCancelAPI(data);
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
    builder
      .addCase(trackingOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(trackingOrder.fulfilled, (state, action) => {
        state.status = 'idle';
      });
    builder
      .addCase(customerRequestCancel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(customerRequestCancel.fulfilled, (state, action) => {
        state.status = 'idle';
      });
    builder
      .addCase(customerConfirmCancel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(customerConfirmCancel.fulfilled, (state, action) => {
        state.status = 'idle';
      });
  },
});

export const {} = OrderSlice.actions;

export default OrderSlice.reducer;

export const orderLoading = (state: AppState) => state.order.status;
