import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState, AppThunk } from '../../store';
import { getSelfProfile } from './userAPI';
import { KeyValue, LoginData } from '../../common/config/interfaces';

export interface UserState {
  status: 'idle' | 'loading' | 'failed';
  userDetail: {
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: boolean;
    phone: string;
    profilePicture: KeyValue;
    address: KeyValue;
  };
}

const initialState: UserState = {
  status: 'idle',
  userDetail: {
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: true,
    phone: '',
    profilePicture: {},
    address: {},
  },
};

export const getLoggedInProfile = createAsyncThunk(
  'user/selfProfile',
  async () => {
    return await getSelfProfile();
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLoggedInProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLoggedInProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        const response = action.payload;
        if (response.isSuccess) {
          state.userDetail = response.data['userInfo'];
        }
      });
  },
});

export const {} = userSlice.actions;

export const userLoggedInDetail = (state: AppState) => state.user.userDetail;
export const userLoading = (state: AppState) => state.user.status;

export default userSlice.reducer;
