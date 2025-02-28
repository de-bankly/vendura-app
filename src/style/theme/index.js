import { createTheme } from '@mui/material/styles';

// Define color palette
const COLORS = {
  primary: {
    main: '#0043C1',
    light: '#3373D9',
    dark: '#00348F',
  },
  secondary: {
    main: '#018abc',
    light: '#4EAFDA',
    dark: '#006A94',
  },
  background: {
    default: '#F5F7FA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1A2027',
    secondary: '#637381',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F5F7FA',
    200: '#EAECF0',
    300: '#D9DDE3',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
  },
  success: {
    main: '#36B37E',
    light: '#86E8AB',
    dark: '#1B806A',
  },
  warning: {
    main: '#FFAB00',
    light: '#FFD666',
    dark: '#B76E00',
  },
  error: {
    main: '#FF5630',
    light: '#FF8F73',
    dark: '#B71D18',
  },
  info: {
    main: '#0065FF',
    light: '#69A1FF',
    dark: '#0041D0',
  },
};

// Create theme
const theme = createTheme({
  palette: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    text: COLORS.text,
    grey: COLORS.grey,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      '@media (min-width:600px)': {
        fontSize: '3.25rem',
      },
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '2rem',
      lineHeight: 1.2,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.4rem',
      },
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.1rem',
      lineHeight: 1.5,
      '@media (min-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.06), 0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 6px 10px rgba(0, 0, 0, 0.06), 0px 12px 20px rgba(0, 0, 0, 0.1)',
    '0px 8px 12px rgba(0, 0, 0, 0.06), 0px 16px 24px rgba(0, 0, 0, 0.1)',
    '0px 12px 16px rgba(0, 0, 0, 0.06), 0px 20px 28px rgba(0, 0, 0, 0.1)',
    '0px 16px 20px rgba(0, 0, 0, 0.06), 0px 24px 32px rgba(0, 0, 0, 0.1)',
    '0px 20px 24px rgba(0, 0, 0, 0.06), 0px 28px 36px rgba(0, 0, 0, 0.1)',
    '0px 24px 28px rgba(0, 0, 0, 0.06), 0px 32px 40px rgba(0, 0, 0, 0.1)',
    '0px 28px 32px rgba(0, 0, 0, 0.06), 0px 36px 44px rgba(0, 0, 0, 0.1)',
    '0px 32px 36px rgba(0, 0, 0, 0.06), 0px 40px 48px rgba(0, 0, 0, 0.1)',
    '0px 36px 40px rgba(0, 0, 0, 0.06), 0px 44px 52px rgba(0, 0, 0, 0.1)',
    '0px 40px 44px rgba(0, 0, 0, 0.06), 0px 48px 56px rgba(0, 0, 0, 0.1)',
    '0px 44px 48px rgba(0, 0, 0, 0.06), 0px 52px 60px rgba(0, 0, 0, 0.1)',
    '0px 48px 52px rgba(0, 0, 0, 0.06), 0px 56px 64px rgba(0, 0, 0, 0.1)',
    '0px 52px 56px rgba(0, 0, 0, 0.06), 0px 60px 68px rgba(0, 0, 0, 0.1)',
    '0px 56px 60px rgba(0, 0, 0, 0.06), 0px 64px 72px rgba(0, 0, 0, 0.1)',
    '0px 60px 64px rgba(0, 0, 0, 0.06), 0px 68px 76px rgba(0, 0, 0, 0.1)',
    '0px 64px 68px rgba(0, 0, 0, 0.06), 0px 72px 80px rgba(0, 0, 0, 0.1)',
    '0px 68px 72px rgba(0, 0, 0, 0.06), 0px 76px 84px rgba(0, 0, 0, 0.1)',
    '0px 72px 76px rgba(0, 0, 0, 0.06), 0px 80px 88px rgba(0, 0, 0, 0.1)',
    '0px 76px 80px rgba(0, 0, 0, 0.06), 0px 84px 92px rgba(0, 0, 0, 0.1)',
    '0px 80px 84px rgba(0, 0, 0, 0.06), 0px 88px 96px rgba(0, 0, 0, 0.1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Inter:wght@300;400;500;600;700&display=swap');
        
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
          background-color: #F5F7FA;
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
          padding: '10px 20px',
          boxShadow: 'none',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderWidth: 1.5,
            },
            '&:hover fieldset': {
              borderWidth: 1.5,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 1.5,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& fieldset': {
            borderWidth: 1.5,
          },
          '&:hover fieldset': {
            borderWidth: 1.5,
          },
          '&.Mui-focused fieldset': {
            borderWidth: 1.5,
          },
        },
        input: {
          padding: '14px 16px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderColor: COLORS.grey[200],
        },
        head: {
          fontWeight: 600,
          backgroundColor: COLORS.grey[50],
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: COLORS.grey[200],
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          minWidth: 'auto',
          padding: '12px 16px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      },
    },
  },
});

export default theme;
