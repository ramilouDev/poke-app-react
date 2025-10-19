import { useState, SyntheticEvent } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { AutoAwesome, Close } from '@mui/icons-material';
import { PokemonDetails } from '@/types/pokemon';
import { TYPE_COLORS } from '@/utils/constants';

interface PokemonCardProps {
  pokemon: PokemonDetails;
  variant?: 'list' | 'grid';
}

export const PokemonCard = ({ pokemon, variant = 'grid' }: PokemonCardProps) => {
  const [shinyModalOpen, setShinyModalOpen] = useState(false);

  const hasShiny = !!pokemon.sprites.front_shiny || !!pokemon.sprites.other?.['official-artwork']?.front_shiny;
  const officialArtwork = pokemon.sprites.other['official-artwork'].front_default;

  const shinyImages = [
    pokemon.sprites.other?.['official-artwork']?.front_shiny,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
  ].filter(Boolean) as string[];

  if (variant === 'list') {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1,
          }}
        >
          {hasShiny && (
            <Chip
              icon={<AutoAwesome />}
              label="Shiny"
              size="small"
              onClick={() => setShinyModalOpen(true)}
              sx={{
                boxShadow: 'var(--shiny-glow)',
                animation: 'pulse 2s infinite',
                background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s',
              }}
            />
          )}
        </Box>

        {hasShiny && (
          <Dialog
            open={shinyModalOpen}
            onClose={(event: SyntheticEvent) => {
              if (event) {
                event.stopPropagation();
              }
              setShinyModalOpen(false);
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogContent>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShinyModalOpen(false);
                  }}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <Close />
                </IconButton>

                <Typography variant="h5" gutterBottom sx={{ textTransform: 'capitalize', mb: 2 }}>
                  {pokemon.name} - Shiny Forms
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  {shinyImages.map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={img}
                      alt={`${pokemon.name} shiny ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
          borderRadius: 2,
        }}
      >
        <CardMedia
          component="img"
          image={officialArtwork}
          alt={pokemon.name}
          sx={{
            height: 200,
            objectFit: 'contain',
            backgroundColor: 'var(--gradient-card)',
            p: 2,
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              textTransform: 'capitalize',
              fontWeight: 'bold',
              mb: 1,
              textAlign: 'center'
            }}
          >
            {pokemon.name}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {pokemon.abilities.slice(0, 2).map((ability, index) => (
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
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
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
                      fontSize: '0.7rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
            
            {hasShiny && (
              <Box sx={{ ml: 1, flexShrink: 0, alignSelf: 'flex-end' }}>
                <Chip
                  icon={<AutoAwesome />}
                  label="Shiny"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('shiny button clicked!!!');
                    setShinyModalOpen(true);
                  }}
                  sx={{
                    boxShadow: 'var(--shiny-glow)',
                    animation: 'pulse 2s infinite',
                    background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                    color: '#000',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.2s',
                  }}
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {hasShiny && (
        <Dialog
          open={shinyModalOpen}
          onClose={(event: SyntheticEvent) => {
            if (event) {
              event.stopPropagation();
            }
            setShinyModalOpen(false);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            <Box sx={{ position: 'relative' }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setShinyModalOpen(false);
                }}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  zIndex: 1,
                }}
              >
                <Close />
              </IconButton>

              <Typography variant="h5" gutterBottom sx={{ textTransform: 'capitalize', mb: 2 }}>
                {pokemon.name} - Shiny Forms
              </Typography>

              {shinyImages.length > 0 ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  {shinyImages.map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={img}
                      alt={`${pokemon.name} shiny ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))',
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No hay versiones shiny disponibles para este Pokémon.
                </Typography>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

