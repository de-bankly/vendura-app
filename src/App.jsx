import { Box, Typography, Container, Button, Paper } from '@mui/material';

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" gutterBottom>
          Vendura App
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Vendura App. This text is using Spectral Light font as specified in our theme.
        </Typography>
        <Typography variant="h2" gutterBottom>
          Typography Example
        </Typography>
        <Typography variant="body1" paragraph>
          This paragraph demonstrates the body text styling with Spectral Light font.
        </Typography>
        <Typography variant="h3" gutterBottom>
          Color Palette
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Primary Colors
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 1, width: 150 }}>
            <Typography variant="body2">#0043C1</Typography>
            <Typography variant="caption">Primary Main</Typography>
          </Box>
          <Box sx={{ bgcolor: 'primary.light', color: 'white', p: 2, borderRadius: 1, width: 150 }}>
            <Typography variant="body2">#0466c8</Typography>
            <Typography variant="caption">Primary Light</Typography>
          </Box>
          <Box sx={{ bgcolor: 'primary.dark', color: 'white', p: 2, borderRadius: 1, width: 150 }}>
            <Typography variant="body2">#023e7d</Typography>
            <Typography variant="caption">Primary Dark</Typography>
          </Box>
        </Box>

        <Typography variant="h4" gutterBottom>
          Secondary Colors
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Box
            sx={{ bgcolor: 'secondary.main', color: 'white', p: 2, borderRadius: 1, width: 150 }}
          >
            <Typography variant="body2">#018abc</Typography>
            <Typography variant="caption">Secondary Main</Typography>
          </Box>
          <Box
            sx={{ bgcolor: 'secondary.light', color: 'white', p: 2, borderRadius: 1, width: 150 }}
          >
            <Typography variant="body2">#36688d</Typography>
            <Typography variant="caption">Secondary Light</Typography>
          </Box>
          <Box
            sx={{ bgcolor: 'secondary.dark', color: 'white', p: 2, borderRadius: 1, width: 150 }}
          >
            <Typography variant="body2">#002855</Typography>
            <Typography variant="caption">Secondary Dark</Typography>
          </Box>
        </Box>

        <Typography variant="h4" gutterBottom>
          Text Colors
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              color: 'text.primary',
              p: 2,
              borderRadius: 1,
              width: 150,
            }}
          >
            <Typography variant="body2">#001845</Typography>
            <Typography variant="caption">Text Primary</Typography>
          </Box>
          <Box
            sx={{
              bgcolor: 'background.paper',
              color: 'text.secondary',
              p: 2,
              borderRadius: 1,
              width: 150,
            }}
          >
            <Typography variant="body2">#4a4a4a</Typography>
            <Typography variant="caption">Text Secondary</Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Button Examples
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">
            Primary Button
          </Button>
          <Button variant="contained" color="secondary">
            Secondary Button
          </Button>
          <Button variant="outlined" color="primary">
            Outlined Button
          </Button>
          <Button variant="text" color="primary">
            Text Button
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
