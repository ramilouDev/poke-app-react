import { useEffect, useRef } from 'react';
import { Box, CircularProgress, Alert, Skeleton } from '@mui/material';
import { usePokemonInfinite, usePokemonDetails, useSearchPokemon } from '@/services/pokemonApi';
import { PokemonCard } from './PokemonCard';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router-dom';
import { setSelectedPokemon } from '@/store/slices/pokemonSlice';
import { SEARCH_MIN_LENGTH, INTERSECTION_THRESHOLD } from '@/utils/constants';

interface PokemonGridItemProps {
  name: string;
}

const PokemonGridItem = ({ name }: PokemonGridItemProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: pokemon, isLoading } = usePokemonDetails(name);

  if (isLoading || !pokemon) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
      </Box>
    );
  }

  const handleClick = () => {
    if (!pokemon) return;
    dispatch(setSelectedPokemon(pokemon));
    navigate(`/pokemon/${pokemon.name}`);
  };

  return (
    <Box onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <PokemonCard pokemon={pokemon} variant="grid" />
    </Box>
  );
};

export const GridView = () => {
  const searchTerm = useAppSelector((state) => state.ui.searchTerm);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePokemonInfinite();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: searchData, isLoading: isSearchLoading } = useSearchPokemon(searchTerm);

  useEffect(() => {
    if (searchTerm.length >= SEARCH_MIN_LENGTH) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: INTERSECTION_THRESHOLD }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, searchTerm]);

  if (searchTerm.length >= SEARCH_MIN_LENGTH) {
    if (isSearchLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (!searchData) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No se encontró ningún Pokémon con el nombre "{searchTerm}"
        </Alert>
      );
    }

    const handleOpen = () => {
      if (!searchData) return;
      dispatch(setSelectedPokemon(searchData));
      navigate(`/pokemon/${searchData.name}`);
    };

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 3,
        }}
      >
        <Box onClick={handleOpen} sx={{ cursor: 'pointer' }}>
          <PokemonCard pokemon={searchData} variant="grid" />
        </Box>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 3,
        }}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <Box key={index}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </Box>
        ))}
      </Box>
    );
  }

  const allPokemon = data?.pages.flatMap((page) => page.results) || [];

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 3,
        }}
      >
        {allPokemon.map((pokemon) => (
          <PokemonGridItem key={pokemon.name} name={pokemon.name} />
        ))}
      </Box>

      <Box
        ref={observerTarget}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          minHeight: 100,
        }}
      >
        {isFetchingNextPage && <CircularProgress size={40} />}
        {!hasNextPage && allPokemon.length > 0 && (
          <Alert severity="info" sx={{ width: '100%' }}>
            Has llegado al final de la Pokédex
          </Alert>
        )}
      </Box>
    </Box>
  );
};

