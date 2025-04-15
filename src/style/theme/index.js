import { createTheme, alpha as muiAlpha } from '@mui/material/styles';

// Define color palette - Modern minimalist colors
const COLORS = {
  primary: {
    main: '#0F172A',
    light: '#334155',
    dark: '#020617',
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
  common: { black: '#000', white: '#fff' },
};

// Add tooltip colors after COLORS is defined
COLORS.tooltip = {
  background: COLORS.grey[700],
  text: COLORS.common.white,
};

// Add common colors if not present
if (!COLORS.common) {
  COLORS.common = { black: '#000', white: '#fff' };
}

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
    tooltip: COLORS.tooltip,
    common: COLORS.common,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (min-width:600px)': {
        fontSize: '3.25rem',
      },
    },
    h2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.4rem',
      },
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
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
      fontWeight: 500,
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
      fontWeight: 500,
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
    '0px 1px 2px rgba(15, 23, 42, 0.06)',
    '0px 1px 3px rgba(15, 23, 42, 0.1)',
    '0px 2px 4px rgba(15, 23, 42, 0.06)',
    '0px 4px 8px rgba(15, 23, 42, 0.06)',
    '0px 8px 16px rgba(15, 23, 42, 0.06)',
    '0px 12px 24px rgba(15, 23, 42, 0.06)',
    '0px 16px 32px rgba(15, 23, 42, 0.06)',
    '0px 20px 40px rgba(15, 23, 42, 0.06)',
    '0px 24px 48px rgba(15, 23, 42, 0.06)',
    '0px 28px 56px rgba(15, 23, 42, 0.06)',
    '0px 32px 64px rgba(15, 23, 42, 0.06)',
    '0px 36px 72px rgba(15, 23, 42, 0.06)',
    '0px 40px 80px rgba(15, 23, 42, 0.06)',
    '0px 44px 88px rgba(15, 23, 42, 0.06)',
    '0px 48px 96px rgba(15, 23, 42, 0.06)',
    '0px 52px 104px rgba(15, 23, 42, 0.06)',
    '0px 56px 112px rgba(15, 23, 42, 0.06)',
    '0px 60px 120px rgba(15, 23, 42, 0.06)',
    '0px 64px 128px rgba(15, 23, 42, 0.06)',
    '0px 68px 136px rgba(15, 23, 42, 0.06)',
    '0px 72px 144px rgba(15, 23, 42, 0.06)',
    '0px 76px 152px rgba(15, 23, 42, 0.06)',
    '0px 80px 160px rgba(15, 23, 42, 0.06)',
    '0px 84px 168px rgba(15, 23, 42, 0.06)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: theme => `
        html, body {
          scroll-behavior: smooth;
        }
        
        /* Accessible focus outline using theme color */
        :focus-visible {
          outline: 2px solid ${theme.palette.primary.light}; /* Use theme token */
          outline-offset: 2px;
        }
        
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${theme.palette.grey[100]};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${theme.palette.grey[400]};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.palette.grey[500]};
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
        }),
        contained: ({ theme }) => ({
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        }),
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            transform: 'translateY(-2px)',
          },
        },
        text: ({ theme }) => ({
          padding: '6px 8px',
          '&:hover': {
            transform: 'translateY(-2px)',
            backgroundColor: muiAlpha(theme.palette.action.active, 0.04),
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          boxShadow: theme.shadows[2],
          transition: 'transform 0.3s, box-shadow 0.3s',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[6],
          },
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: ({ theme }) => ({
          borderRadius: 12,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          marginBottom: theme.spacing(0.5),
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.contrastText,
            },
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          border: 'none',
          boxShadow: theme.shadows[8],
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.grey[200],
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.grey[200],
        }),
        head: ({ theme }) => ({
          fontWeight: 600,
          backgroundColor: theme.palette.grey[50],
        }),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.75rem',
          height: 24,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[2],
        }),
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: ({ theme }) => ({
          fontWeight: 600,
          fontSize: theme.typography.pxToRem(12),
        }),
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        selected: {
          fontWeight: 700,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 600,
          textTransform: 'none',
          minWidth: 'auto',
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          '&.Mui-selected': {
            fontWeight: 700,
          },
        }),
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(2),
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.palette.tooltip.background,
          color: theme.palette.tooltip.text,
          fontSize: theme.typography.pxToRem(12),
          padding: theme.spacing(0.75, 1.5),
          borderRadius: theme.shape.borderRadius * 0.5,
          boxShadow: theme.shadows[1],
        }),
        arrow: ({ theme }) => ({
          color: theme.palette.tooltip.background,
        }),
      },
    },
  },
});

export default theme;
