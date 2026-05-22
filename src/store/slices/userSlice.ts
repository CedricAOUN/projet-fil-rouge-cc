import { authApi, AuthUser } from '@/api/authApi';
import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      // logout
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      // register
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.currentUser = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem('token', action.payload.access_token);
        },
      )
      .addMatcher(authApi.endpoints.register.matchRejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
        localStorage.removeItem('token');
      })
      // getCurrentUser - Persist user session on app load
      .addMatcher(authApi.endpoints.getCurrentUser.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.currentUser = action.payload.data;
          state.isAuthenticated = true;
        },
      )
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
        localStorage.removeItem('token');
      });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
