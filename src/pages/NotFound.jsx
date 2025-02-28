import { Box, Typography, Container, Button, Paper, Grid, Divider } from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * Enhanced 404 Not Found page
 * Provides helpful navigation options and suggestions to users
 */
const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Common navigation links to suggest to users
  const navigationSuggestions = [
    { text: 'Home Page', path: '/', icon: <HomeIcon fontSize="small" /> },
    { text: 'About', path: '/about', icon: <HelpOutlineIcon fontSize="small" /> },
    { text: 'Component Showcase', path: '/showcase', icon: <HelpOutlineIcon fontSize="small" /> },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />

          <Typography
            variant="h2"
            sx={{ fontSize: { xs: '3rem', md: '4rem' }, color: 'primary.main', fontWeight: 'bold' }}
          >
            404
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
            Page Not Found
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            We couldn't find the page you're looking for:{' '}
            <Box component="span" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
              {location.pathname}
            </Box>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              What happened?
            </Typography>
            <Typography variant="body2" paragraph>
              The page you requested either doesn't exist, has been moved, or you might have
              mistyped the URL.
            </Typography>

            <Typography variant="h6" gutterBottom>
              What can you do?
            </Typography>
            <Typography variant="body2" paragraph>
              Check the URL for typos, use the navigation menu, or try one of the suggested links
              below.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Try these pages instead:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {navigationSuggestions.map(item => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  variant="text"
                  color="primary"
                  startIcon={item.icon}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
