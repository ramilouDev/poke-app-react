import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PokemonListResponse, PokemonDetails, PokemonSpecies, PokemonMove } from '@/types/pokemon';
import { BASE_URL, ITEMS_PER_PAGE, SEARCH_MIN_LENGTH, STALE_TIME } from '@/utils/constants';

export { ITEMS_PER_PAGE };

export const getPokemonId = (url: string): number => {
  const matches = url.match(/\/(\d+)\//);
  return matches ? parseInt(matches[1]) : 0;
};

const fetchPokemonList = async (page: number): Promise<PokemonListResponse> => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const response = await fetch(`${BASE_URL}/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
};

const fetchPokemonDetails = async (nameOrId: string | number): Promise<PokemonDetails> => {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon details');
  }
  return response.json();
};

export const usePokemonList = (page: number) => {
  return useQuery({
    queryKey: ['pokemon', 'list', page],
    queryFn: () => fetchPokemonList(page),
    staleTime: STALE_TIME.SHORT, // 5 minutes
  });
};

export const usePokemonInfinite = () => {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'infinite'],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(pageParam + 1),
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage.count;
      const currentCount = allPages.length * ITEMS_PER_PAGE;
      return currentCount < totalCount ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: STALE_TIME.SHORT, // 5 minutes
  });
};

export const usePokemonDetails = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['pokemon', 'details', name],
    queryFn: () => fetchPokemonDetails(name.toLowerCase()),
    enabled: enabled && !!name,
    staleTime: STALE_TIME.LONG, // 10 minutes
  });
};

export const useSearchPokemon = (searchTerm: string) => {
  return useQuery({
    queryKey: ['pokemon', 'search', searchTerm],
    queryFn: async () => {
      try {
        const data = await fetchPokemonDetails(searchTerm.toLowerCase());
        return data;
      } catch (error) {
        return null;
      }
    },
    enabled: searchTerm.length >= SEARCH_MIN_LENGTH,
    staleTime: STALE_TIME.LONG,
  });
};

const fetchPokemonSpecies = async (nameOrId: string | number): Promise<PokemonSpecies> => {
  const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon species');
  }
  return response.json();
};

const fetchPokemonMove = async (name: string): Promise<PokemonMove> => {
  const response = await fetch(`${BASE_URL}/move/${name}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon move');
  }
  return response.json();
};

export const usePokemonSpecies = (nameOrId: string | number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['pokemon', 'species', nameOrId],
    queryFn: () => fetchPokemonSpecies(nameOrId),
    enabled: enabled && !!nameOrId,
    staleTime: STALE_TIME.LONG,
  });
};

export const usePokemonMove = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['pokemon', 'move', name],
    queryFn: () => fetchPokemonMove(name),
    enabled: enabled && !!name,
    staleTime: STALE_TIME.LONG,
  });
};

