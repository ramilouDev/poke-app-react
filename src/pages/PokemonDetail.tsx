import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedPokemon, setPokemonDescription } from '@/store/slices/pokemonSlice';
import { usePokemonDetails, usePokemonSpecies, usePokemonMove } from '@/services/pokemonApi';
import { TYPE_COLORS } from '@/utils/constants';

export const PokemonDetail = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedPokemon = useAppSelector((state) => state.pokemon.selectedPokemon);
  const cachedDescription = useAppSelector((state) => state.pokemon.pokemonDescription);

  const shouldFetch = !selectedPokemon || selectedPokemon.name !== name;
  
  const { data: pokemonData, isLoading: isPokemonLoading } = usePokemonDetails(name || '', shouldFetch);
  const { data: speciesData } = usePokemonSpecies(name || '', !!name);
  
  const pokemon = shouldFetch ? pokemonData : selectedPokemon;
  
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);

  useEffect(() => {
    if (pokemon?.moves) {
      setSelectedMoves(pokemon.moves.slice(0, 6).map(m => m.move.name));
    } else {
      setSelectedMoves([]);
    }
  }, [pokemon?.name, pokemon?.moves]);

  useEffect(() => {
    if (pokemonData && shouldFetch) {
      dispatch(setSelectedPokemon(pokemonData));
    }
  }, [pokemonData, shouldFetch, dispatch]);

  useEffect(() => {
    if (speciesData && !cachedDescription) {
      const description = speciesData.flavor_text_entries
        .find(entry => entry.language.name === 'es')?.flavor_text
        || speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text
        || 'Descripción no disponible';
      
      dispatch(setPokemonDescription(description.replace(/\f/g, ' ')));
    }
  }, [speciesData, cachedDescription, dispatch]);

  const sprites = pokemon ? [
    { url: pokemon.sprites.other['official-artwork'].front_default, label: 'Normal' },
    { url: pokemon.sprites.other['official-artwork'].front_shiny, label: 'Shiny' },
    { url: pokemon.sprites.front_default, label: 'Frente Normal' },
    { url: pokemon.sprites.front_shiny, label: 'Frente Shiny' },
    { url: pokemon.sprites.back_default, label: 'Espalda Normal' },
    { url: pokemon.sprites.back_shiny, label: 'Espalda Shiny' },
  ].filter(sprite => sprite.url) : [];

  if (isPokemonLoading || !pokemon) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!name) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          No se especificó un Pokémon
        </Alert>
      </Container>
    );
  }

  const description = cachedDescription || 'Cargando descripción...';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBack />
      </IconButton>

      <Box
        sx={{
          backgroundColor: '#2ecc71',
          borderRadius: 4,
          p: 4,
          mb: 3,
          position: 'relative',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          Galería de Sprites
        </Typography>
        
        <Box sx={{ width: '100%', maxWidth: 600, position: 'relative' }}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{ clickable: true }}
            style={{ borderRadius: '16px' }}
          >
            {sprites.map((sprite, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 300,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={sprite.url!}
                    alt={sprite.label}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <IconButton
            className="swiper-button-prev-custom"
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
            }}
          >
            <ChevronLeft />
          </IconButton>
          
          <IconButton
            className="swiper-button-next-custom"
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
        gap: 3 
      }}>
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" sx={{ textTransform: 'capitalize', fontWeight: 'bold', mb: 2 }}>
              {pokemon.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {pokemon.types.map((type) => (
                <Chip
                  key={type.type.name}
                  label={type.type.name}
                  sx={{
                    backgroundColor: TYPE_COLORS[type.type.name] || '#777',
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    fontSize: '1rem',
                    px: 2,
                    py: 2.5,
                  }}
                />
              ))}
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              <strong>Descripción:</strong> {description}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Habilidades
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {pokemon.abilities.map((ability, index) => (
                <Box key={index}>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    <strong>Habilidad:</strong> {ability.ability.name.replace(/-/g, ' ')}
                    {ability.is_hidden && ' (Oculta)'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Movimientos
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedMoves.map((moveName, index) => (
                <MoveDetails key={index} moveName={moveName} />
              ))}
            </Box>
            
            {pokemon.moves.length > 6 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Mostrando {selectedMoves.length} de {pokemon.moves.length} movimientos
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

const MoveDetails = ({ moveName }: { moveName: string }) => {
  const { data: moveData, isLoading } = usePokemonMove(moveName);

  if (isLoading) {
    return (
      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (!moveData) {
    return null;
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize', mb: 1 }}>
        {moveName.replace(/-/g, ' ')}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Poder</Typography>
          <Typography variant="body2" fontWeight="bold">{moveData.power || '-'}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Precisión</Typography>
          <Typography variant="body2" fontWeight="bold">{moveData.accuracy || '-'}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Tipo</Typography>
          <Chip
            label={moveData.type.name}
            size="small"
            sx={{
              backgroundColor: TYPE_COLORS[moveData.type.name] || '#777',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

