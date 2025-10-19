import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CatchingPokemon } from '@mui/icons-material';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <CatchingPokemon sx={{ fontSize: 100, color: 'primary.main' }} />
        <Typography variant="h2" component="h1" fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" color="text.secondary">
          ¡Página no encontrada!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
          sx={{
            mt: 2,
            background: 'var(--gradient-hero)',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          Volver a la Pokédex
        </Button>
      </Box>
    </Container>
  );
};

