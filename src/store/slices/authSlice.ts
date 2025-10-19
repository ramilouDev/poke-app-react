import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const getInitialState = (): AuthState => {
  const token = localStorage.getItem('pokemon_token');
  const userStr = localStorage.getItem('pokemon_user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user,
        token,
      };
    } catch {
      localStorage.removeItem('pokemon_token');
      localStorage.removeItem('pokemon_user');
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      localStorage.setItem('pokemon_token', action.payload.token);
      localStorage.setItem('pokemon_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      localStorage.removeItem('pokemon_token');
      localStorage.removeItem('pokemon_user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
