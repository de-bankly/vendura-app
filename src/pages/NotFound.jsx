import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ fontSize: '6rem', color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" color="primary" size="large" onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </Container>
  );
};

export default NotFound;
