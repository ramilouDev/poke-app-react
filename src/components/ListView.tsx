import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  Skeleton,
  Alert,
  Typography,
  Chip,
} from '@mui/material';
import { usePokemonList, usePokemonDetails, useSearchPokemon } from '@/services/pokemonApi';
import { PokemonCard } from './PokemonCard';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedPokemon } from '@/store/slices/pokemonSlice';
import { TYPE_COLORS, ITEMS_PER_PAGE, SEARCH_MIN_LENGTH } from '@/utils/constants';

interface PokemonRowProps {
  name: string;
}

const PokemonRow = ({ name }: PokemonRowProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: pokemon, isLoading } = usePokemonDetails(name);

  const handleRowClick = () => {
    if (pokemon) {
      dispatch(setSelectedPokemon(pokemon));
      navigate(`/pokemon/${pokemon.name}`);
    }
  };

  if (isLoading || !pokemon) {
    return (
      <TableRow>
        <TableCell align="center"><Skeleton width={40} /></TableCell>
        <TableCell align="center"><Skeleton width={100} /></TableCell>
        <TableCell align="center"><Skeleton width={60} height={60} /></TableCell>
        <TableCell align="center"><Skeleton width={120} /></TableCell>
        <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          <Skeleton width={60} />
        </TableCell>
        <TableCell align="center"><Skeleton width={60} /></TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow 
      hover 
      onClick={handleRowClick}
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <TableCell align="center">
        <Typography variant="body2" fontWeight="bold">
          {pokemon.id}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
          {pokemon.name}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Box
          component="img"
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          sx={{
            width: 60,
            height: 60,
            objectFit: 'contain',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {pokemon.types.map((type) => (
            <Chip
              key={type.type.name}
              label={type.type.name}
              size="small"
              sx={{
                backgroundColor: TYPE_COLORS[type.type.name] || '#777',
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            />
          ))}
        </Box>
      </TableCell>

      <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
          {pokemon.abilities.map((ability, index) => (
            <Chip
              key={index}
              label={ability.ability.name}
              size="small"
              variant={ability.is_hidden ? "outlined" : "filled"}
              sx={{
                backgroundColor: ability.is_hidden ? 'transparent' : 'primary.main',
                color: ability.is_hidden ? 'primary.main' : 'white',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                fontSize: '0.7rem',
                width: 'fit-content',
              }}
            />
          ))}
        </Box>
      </TableCell>

      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
        <PokemonCard pokemon={pokemon} variant="list" />
      </TableCell>
    </TableRow>
  );
};

export const ListView = () => {
  const [page, setPage] = useState(1);
  const searchTerm = useAppSelector((state) => state.ui.searchTerm);

  const { data: listData, isLoading: isListLoading } = usePokemonList(page);
  const { data: searchData, isLoading: isSearchLoading } = useSearchPokemon(searchTerm);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (searchTerm.length >= SEARCH_MIN_LENGTH) {
    if (isSearchLoading) {
      return null;
    }

    if (!searchData) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No se encontró ningún Pokémon con el nombre "{searchTerm}"
        </Alert>
      );
    }
    // If searching, show search results
    return (
      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--gradient-card)' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vista Previa</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tipos</TableCell>
              <TableCell align="center"  sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>
                Habilidades
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <PokemonRow name={searchData.name} />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (isListLoading || !listData) {
    return null;
  }

  const totalPages = Math.ceil(listData.count / ITEMS_PER_PAGE);

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--gradient-card)' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vista Previa</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tipos</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>
                Habilidades
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listData.results.map((pokemon) => (
              <PokemonRow key={pokemon.name} name={pokemon.name} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

