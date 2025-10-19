import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PokemonDetails } from '@/types/pokemon';

interface PokemonState {
  selectedPokemon: PokemonDetails | null;
  pokemonDescription: string | null;
}

const initialState: PokemonState = {
  selectedPokemon: null,
  pokemonDescription: null,
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setSelectedPokemon: (state, action: PayloadAction<PokemonDetails>) => {
      state.selectedPokemon = action.payload;
    },
    setPokemonDescription: (state, action: PayloadAction<string>) => {
      state.pokemonDescription = action.payload;
    },
    clearSelectedPokemon: (state) => {
      state.selectedPokemon = null;
      state.pokemonDescription = null;
    },
  },
});

export const { setSelectedPokemon, setPokemonDescription, clearSelectedPokemon } = pokemonSlice.actions;
export default pokemonSlice.reducer;

