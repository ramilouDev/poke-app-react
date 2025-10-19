import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import pokemonReducer from './slices/pokemonSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    pokemon: pokemonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

