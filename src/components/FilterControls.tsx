import { useState, useEffect } from 'react';
import { Box, TextField, ToggleButton, ToggleButtonGroup, InputAdornment } from '@mui/material';
import { Search, ViewList, ViewModule } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchTerm, setViewMode, ViewMode } from '@/store/slices/uiSlice';
import { DEBOUNCE_DELAY } from '@/utils/constants';

export const FilterControls = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => state.ui.viewMode);
  const searchTermFromStore = useAppSelector((state) => state.ui.searchTerm);
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTermFromStore);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchTerm(localSearchTerm));
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [localSearchTerm, dispatch]);

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      dispatch(setViewMode(newViewMode));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <TextField
        placeholder="Buscar Pokémon por nombre..."
        variant="outlined"
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{
          flexGrow: 1,
          minWidth: { xs: '100%', sm: '300px' },
        }}
      />

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        aria-label="view mode"
        sx={{
          backgroundColor: 'background.paper',
        }}
      >
        <ToggleButton value="list" aria-label="list view">
          <ViewList />
        </ToggleButton>
        <ToggleButton value="grid" aria-label="grid view">
          <ViewModule />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

