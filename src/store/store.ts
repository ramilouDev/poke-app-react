import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import pokemonReducer from './slices/pokemonSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    pokemon: pokemonReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

