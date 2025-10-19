import { AppBar, Toolbar, Box, Typography } from '@mui/material';

export const Header = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'var(--gradient-hero)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: '100%',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.05em',
            }}
          >
            Pokédex
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

