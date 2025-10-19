export const TYPE_COLORS: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

export const BASE_URL = 'https://pokeapi.co/api/v2';

export const ITEMS_PER_PAGE = 15;

export const SEARCH_MIN_LENGTH = 2;

export const INTERSECTION_THRESHOLD = 0.8;

export const STALE_TIME = {
    SHORT: 5 * 60 * 1000,
    LONG: 10 * 60 * 1000,
};

export const QUERY_RETRY = 1;

export const DEBOUNCE_DELAY = 500;