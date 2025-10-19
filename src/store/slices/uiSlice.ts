import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ViewMode = 'list' | 'grid';

interface UIState {
  viewMode: ViewMode;
  searchTerm: string;
}

const initialState: UIState = {
  viewMode: 'list',
  searchTerm: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
    },
  },
});

export const { setViewMode, setSearchTerm, clearSearch } = uiSlice.actions;
export default uiSlice.reducer;

