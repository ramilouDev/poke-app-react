import { AppBar, Toolbar, Box, Typography, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

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
              flexGrow: 1,
            }}
          >
            Pokédex
          </Typography>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                Hola, {user.name}
              </Typography>
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                title="Cerrar sesión"
              >
                <Logout />
              </IconButton>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

