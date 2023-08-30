import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import authReducer from './features/auth/authSlice';
import cityReducer from './features/city/citySlice';
import districtReducer from './features/district/districtSlice';
import wardReducer from './features/ward/wardSlice';
import streetReducer from './features/street/streetSlice';
import configReducer from './features/config/configSlice';
import orderReducer from './features/order/orderSlice';
import photoReducer from './features/photo/photoSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      city: cityReducer,
      district: districtReducer,
      ward: wardReducer,
      street: streetReducer,
      config: configReducer,
      order: orderReducer,
      photo: photoReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
