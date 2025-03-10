import { createTheme } from '@mui/material/styles';

// Define color palette
const COLORS = {
  primary: {
    main: '#2563EB',
    light: '#60A5FA',
    dark: '#1E40AF',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#10B981',
    light: '#6EE7B7',
    dark: '#047857',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  success: {
    main: '#10B981',
    light: '#6EE7B7',
    dark: '#047857',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#B45309',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#FCA5A5',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6',
    light: '#93C5FD',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
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
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (min-width:600px)': {
        fontSize: '3.25rem',
      },
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
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
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.06), 0px 1px 3px rgba(15, 23, 42, 0.1)',
    '0px 2px 4px rgba(15, 23, 42, 0.06), 0px 4px 6px rgba(15, 23, 42, 0.1)',
    '0px 4px 8px rgba(15, 23, 42, 0.06), 0px 8px 16px rgba(15, 23, 42, 0.1)',
    '0px 6px 10px rgba(15, 23, 42, 0.06), 0px 12px 20px rgba(15, 23, 42, 0.1)',
    '0px 8px 12px rgba(15, 23, 42, 0.06), 0px 16px 24px rgba(15, 23, 42, 0.1)',
    '0px 12px 16px rgba(15, 23, 42, 0.06), 0px 20px 28px rgba(15, 23, 42, 0.1)',
    '0px 16px 20px rgba(15, 23, 42, 0.06), 0px 24px 32px rgba(15, 23, 42, 0.1)',
    '0px 20px 24px rgba(15, 23, 42, 0.06), 0px 28px 36px rgba(15, 23, 42, 0.1)',
    '0px 24px 28px rgba(15, 23, 42, 0.06), 0px 32px 40px rgba(15, 23, 42, 0.1)',
    '0px 28px 32px rgba(15, 23, 42, 0.06), 0px 36px 44px rgba(15, 23, 42, 0.1)',
    '0px 32px 36px rgba(15, 23, 42, 0.06), 0px 40px 48px rgba(15, 23, 42, 0.1)',
    '0px 36px 40px rgba(15, 23, 42, 0.06), 0px 44px 52px rgba(15, 23, 42, 0.1)',
    '0px 40px 44px rgba(15, 23, 42, 0.06), 0px 48px 56px rgba(15, 23, 42, 0.1)',
    '0px 44px 48px rgba(15, 23, 42, 0.06), 0px 52px 60px rgba(15, 23, 42, 0.1)',
    '0px 48px 52px rgba(15, 23, 42, 0.06), 0px 56px 64px rgba(15, 23, 42, 0.1)',
    '0px 52px 56px rgba(15, 23, 42, 0.06), 0px 60px 68px rgba(15, 23, 42, 0.1)',
    '0px 56px 60px rgba(15, 23, 42, 0.06), 0px 64px 72px rgba(15, 23, 42, 0.1)',
    '0px 60px 64px rgba(15, 23, 42, 0.06), 0px 68px 76px rgba(15, 23, 42, 0.1)',
    '0px 64px 68px rgba(15, 23, 42, 0.06), 0px 72px 80px rgba(15, 23, 42, 0.1)',
    '0px 68px 72px rgba(15, 23, 42, 0.06), 0px 76px 84px rgba(15, 23, 42, 0.1)',
    '0px 72px 76px rgba(15, 23, 42, 0.06), 0px 80px 88px rgba(15, 23, 42, 0.1)',
    '0px 76px 80px rgba(15, 23, 42, 0.06), 0px 84px 92px rgba(15, 23, 42, 0.1)',
    '0px 80px 84px rgba(15, 23, 42, 0.06), 0px 88px 96px rgba(15, 23, 42, 0.1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        
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
          background-color: #F8FAFC;
          color: #1E293B;
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

        ::selection {
          background-color: rgba(37, 99, 235, 0.2);
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          boxShadow: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(37, 99, 235, 0.25)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #10B981, #047857)',
          '&:hover': {
            background: 'linear-gradient(135deg, #34D399, #10B981)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.08)',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(15, 23, 42, 0.12)',
          },
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
          padding: '20px 24px',
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
            borderRadius: 10,
            '& fieldset': {
              borderWidth: 1.5,
              transition: 'border-color 0.2s ease',
            },
            '&:hover fieldset': {
              borderWidth: 1.5,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 1.5,
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '& fieldset': {
            borderWidth: 1.5,
          },
          '&:hover fieldset': {
            borderWidth: 1.5,
          },
          '&.Mui-focused': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.1)',
            '& fieldset': {
              borderWidth: 1.5,
            },
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
          '&:hover': {
            backgroundColor: `rgba(37, 99, 235, 0.04)`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '0px 8px 16px rgba(15, 23, 42, 0.1)',
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
          transition: 'all 0.2s ease',
          '&:hover': {
            color: COLORS.primary.main,
            backgroundColor: `rgba(37, 99, 235, 0.04)`,
          },
          '&.Mui-selected': {
            color: COLORS.primary.main,
          },
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
          },
          '&.MuiChip-colorSecondary': {
            background: 'linear-gradient(135deg, #10B981, #047857)',
          },
          '&.MuiChip-colorSuccess': {
            background: 'linear-gradient(135deg, #10B981, #047857)',
          },
          '&.MuiChip-colorError': {
            background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
          },
          '&.MuiChip-colorWarning': {
            background: 'linear-gradient(135deg, #F59E0B, #B45309)',
          },
          '&.MuiChip-colorInfo': {
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.1)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
        },
      },
    },
  },
});

export default theme;
