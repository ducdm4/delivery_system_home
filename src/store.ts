import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from './features/counter/counterSlice';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';
import cityReducer from './features/city/citySlice';

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      auth: authReducer,
      user: userReducer,
      city: cityReducer,
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
