import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';

const schema = yup.object({
  email: yup
    .string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

type FormData = yup.InferType<typeof schema>;

const DUMMY_USERS = [
  { email: 'sunwise@pokemon.com', password: '123456', name: 'Administrador' },
  { email: 'user@pokemon.com', password: 'pokemon', name: 'Entrenador' },
  { email: 'test@pokemon.com', password: 'pikachu', name: 'Ash Ketchum' },
];

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const user = DUMMY_USERS.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (user) {
      const token = `dummy_token_${Date.now()}`;
      dispatch(login({ 
        user: { email: user.email, name: user.name }, 
        token 
      }));
      navigate('/');
    } else {
      setError('root', {
        type: 'manual',
        message: 'Credenciales incorrectas',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Pokédex
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email')}
              fullWidth
              label="Correo Electrónico"
              type="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            />

            <TextField
              {...register('password')}
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            />

            {errors.root && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.root.message}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: '#333',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              <strong>Usuarios de prueba:</strong>
            </Typography>
            {DUMMY_USERS.map((user, index) => (
              <Typography key={index} variant="caption" color="text.secondary" display="block">
                {user.email} / {user.password}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
