import { createTheme } from '@mui/material/styles';

// Define color palette
const COLORS = {
  primary: {
    main: '#0043C1',
    light: '#0466c8',
    dark: '#023e7d',
  },
  secondary: {
    main: '#018abc',
    light: '#36688d',
    dark: '#002855',
  },
  background: {
    default: '#ffffff',
    paper: '#f8f9fa',
  },
  text: {
    primary: '#001845',
    secondary: '#4a4a4a',
  },
};

// Create theme
const theme = createTheme({
  palette: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    text: COLORS.text,
  },
  typography: {
    fontFamily: '"Spectral", serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800, // Extra Bold
      fontSize: '2.5rem',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '2.75rem',
      },
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.75rem',
      '@media (min-width:600px)': {
        fontSize: '2.25rem',
      },
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.25rem',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.1rem',
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    body1: {
      fontFamily: '"Spectral", serif',
      fontWeight: 300, // Light
      fontSize: '1rem',
    },
    body2: {
      fontFamily: '"Spectral", serif',
      fontWeight: 300,
      fontSize: '0.875rem',
    },
    button: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Spectral:wght@300&display=swap');
        
        *, *::before, *::after {
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
        
        body {
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        img, picture, video, canvas, svg {
          display: block;
          max-width: 100%;
        }
        
        input, button, textarea, select {
          font: inherit;
        }
        
        p, h1, h2, h3, h4, h5, h6 {
          overflow-wrap: break-word;
          margin: 0;
        }
        
        #root {
          height: 100%;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
