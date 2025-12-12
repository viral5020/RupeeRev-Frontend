import React from 'react';
import { Box, Button, Container, Divider, Grid, IconButton, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// Google Icon SVG
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8328C15.5862 13.0765 14.7219 14.5543 13.3265 15.4676L13.3066 15.5895L16.3352 17.8837L16.5443 17.9048C18.4676 16.179 19.5769 13.6364 19.9895 10.1871Z" fill="#4285F4" />
    <path d="M10.1993 19.9313C12.9546 19.9313 15.2643 19.0454 16.9985 17.4814L13.6511 14.9266C12.7332 15.5271 11.5657 15.8805 10.1993 15.8805C7.54142 15.8805 5.28937 14.1267 4.48294 11.7484L4.36845 11.7579L1.21813 14.1379L1.17871 14.2496C2.94371 17.6813 6.31879 19.9313 10.1993 19.9313Z" fill="#34A853" />
    <path d="M4.48294 11.7484C4.27542 11.1425 4.15842 10.4944 4.15842 9.82696C4.15842 9.15956 4.27542 8.51141 4.48294 7.90552L4.47728 7.78604L1.28971 5.3811L1.17871 5.40437C0.448552 6.82005 0.0335693 8.42289 0.0335693 10.1065C0.0335693 11.7901 0.448552 13.393 1.17871 14.8086L4.48294 11.7484Z" fill="#FBBC05" />
    <path d="M10.1993 4.05301C11.7011 4.05301 13.0487 4.55774 14.1111 5.53771L17.0785 2.63451C15.2588 0.977273 12.9546 0 10.1993 0C6.31879 0 2.94371 2.25 1.17871 5.68172L4.48294 8.12201C5.28937 5.74374 7.54142 4.05301 10.1993 4.05301Z" fill="#EB4335" />
  </svg>
);

const LoginPage: React.FC = () => {
  const { login, register, loading } = useAuth();

  const [mode, setMode] = React.useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });

  // Get redirect parameter from URL
  const searchParams = new URLSearchParams(window.location.search);
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleGoogleLogin = () => {
    const redirectUrl = encodeURIComponent(redirect);
    window.location.href = `${process.env.REACT_APP_BACKEND_API_ENDPOINT}/auth/google?redirect=${redirectUrl}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === 'login') {
      await login(form.email, form.password);
    } else {
      await register(form.name, form.email, form.password);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side - Image & Branding */}
      <Grid item xs={12} md={6} sx={{
        position: 'relative',
        bgcolor: '#0f172a',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 6,
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1611974765270-ca1258634369?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          zIndex: 0
        }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}>
              ₹
            </Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              RupeeRev
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
            Master your money,<br /> design your future.
          </Typography>
          <Typography variant="h6" sx={{ color: 'gray.300', fontWeight: 400, maxWidth: 480 }}>
            Join thousands of users who are taking control of their financial life with AI-driven insights.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side - Form */}
      <Grid item xs={12} md={6} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper'
      }}>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              mb: 4
            }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                ₹
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                RupeeRev
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {mode === 'login' ? 'Please enter your details to sign in.' : 'Start your 30-day free trial.'}
            </Typography>
          </Box>

          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                py: 1.5,
                color: 'text.primary',
                borderColor: 'divider',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: 'text.primary'
                }
              }}
            >
              Sign in with Google
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">OR</Typography>
            </Divider>

            {mode === 'register' && (
              <TextField
                label="Full Name"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              label="Email address"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <Box
                component="span"
                onClick={toggleMode}
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </Box>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default LoginPage;

