import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom sx={{ color: 'primary.main' }}>
          Welcome to Vendura
        </Typography>
        <Typography variant="body1" paragraph>
          Your modern banking application
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/showcase')}
            sx={{ mr: 2 }}
          >
            View Component Showcase
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/about')}
          >
            About Us
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
