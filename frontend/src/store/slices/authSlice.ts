import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initialize state from localStorage
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  let user: User | null = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  return {
    user,
    token,
    isAuthenticated: !!(token && user),
    isLoading: false,
  };
};

const initialState: AuthState = getInitialState();

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
      
      // Persist to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Clear localStorage
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
          console.error('Error loading user from localStorage:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
    clearError: (state) => {
      state.isLoading = false;
    }
  },
});

export const { setLoading, loginSuccess, logout, loadUserFromStorage, clearError } = authSlice.actions;
export default authSlice.reducer;