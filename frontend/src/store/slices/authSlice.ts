import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (token && userString) {
        try {
          const user = JSON.parse(userString);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    },
  },
});

export const { setLoading, loginSuccess, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;