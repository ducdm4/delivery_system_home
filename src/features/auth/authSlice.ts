import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState, AppThunk } from '../../store';
import { login, verifyUser } from './authAPI';
import { APIResponse, LoginData } from '../../common/config/interfaces';
import Dict = NodeJS.Dict;

export interface AuthState {
  user: Dict<any>;
  tokens: object;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  user: {},
  tokens: {},
  status: 'idle',
};

export const userLogin = createAsyncThunk(
  'auth/login',
  async (loginInfo: LoginData): Promise<APIResponse> => {
    const response = await login(loginInfo);
    return response;
  },
);

export const verifyUserLogin = createAsyncThunk(
  'auth/verify',
  async (): Promise<APIResponse> => {
    const response = await verifyUser();
    return response;
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = 'idle';
        const response = action.payload;
        if (response.isSuccess) {
          state.user = response.data['user'];
          state.tokens = response.data['tokens'];
          const { accessToken, refreshToken } = state.tokens as {
            accessToken: string;
            refreshToken: string;
          };
          if (process.env.NEXT_PUBLIC_API_KEY) {
            localStorage.setItem(process.env.NEXT_PUBLIC_API_KEY, accessToken);
          }
          if (process.env.NEXT_PUBLIC_API_REFRESH) {
            localStorage.setItem(
              process.env.NEXT_PUBLIC_API_REFRESH,
              refreshToken,
            );
          }
        }
      });

    builder
      .addCase(verifyUserLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyUserLogin.fulfilled, (state, action) => {
        state.status = 'idle';
        const response = action.payload;
        if (response.isSuccess) {
          state.user = response.data['user'];
        }
        console.log('ducdm2', state.user);
        console.log('ducdm3', response);
      });
  },
});

export const {} = authSlice.actions;

export const userLoggedIn = (state: AppState) => state.auth.user;

export default authSlice.reducer;
