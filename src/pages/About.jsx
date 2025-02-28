import { Box, Typography, Container, Paper } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom sx={{ color: 'primary.main' }}>
          About Vendura
        </Typography>
        <Typography variant="body1" paragraph>
          Vendura is a modern banking application designed to provide users with a seamless and
          intuitive financial management experience. Our platform combines cutting-edge technology
          with user-friendly design to make banking accessible and efficient.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'secondary.main' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          To transform the banking experience through innovative technology and exceptional user
          experience, making financial management simple, secure, and accessible for everyone.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'secondary.main' }}>
          Our Vision
        </Typography>
        <Typography variant="body1" paragraph>
          To become the leading digital banking platform known for its reliability, security, and
          user-centered approach to financial services.
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
