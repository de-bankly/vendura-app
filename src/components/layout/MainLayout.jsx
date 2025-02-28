import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
  Avatar,
  Tooltip,
  Badge,
  Paper,
  Divider,
  Fade,
  Zoom,
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import BugReportIcon from '@mui/icons-material/BugReport';
import ErrorIcon from '@mui/icons-material/Error';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeCategory, setActiveCategory] = useState('main');

  // Update sidebar state when screen size changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Navigation categories
  const navigationCategories = {
    main: [
      { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
      { text: 'Kasse', path: '/pos', icon: <PointOfSaleIcon /> },
      { text: 'Lager', path: '/inventory', icon: <InventoryIcon /> },
    ],
    other: [
      { text: 'Component Showcase', path: '/showcase', icon: <ViewModuleIcon /> },
      { text: 'About', path: '/about', icon: <InfoIcon /> },
    ],
    system: [
      { text: 'Error Test', path: '/error-test', icon: <BugReportIcon /> },
      { text: 'Route Error', path: '/error-page', icon: <ErrorIcon /> },
    ],
  };

  // Footer navigation items
  const footerNavItems = [
    {
      text: 'Einstellungen',
      icon: <SettingsIcon />,
      action: () => console.log('Settings clicked'),
    },
    { text: 'Hilfe', icon: <HelpOutlineIcon />, action: () => console.log('Help clicked') },
    { text: 'Abmelden', icon: <LogoutIcon />, action: () => console.log('Logout clicked') },
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = path => {
    return location.pathname === path;
  };

  // Calculate sidebar width based on state
  const sidebarWidth = 280;
  const collapsedWidth = 72;
  const currentWidth = sidebarOpen ? sidebarWidth : collapsedWidth;

  // Render navigation items for a specific category
  const renderNavItems = (items, category) => {
    return items.map(item => (
      <Zoom
        key={item.text}
        in={true}
        style={{
          transitionDelay: `${items.indexOf(item) * 50}ms`,
          transitionDuration: '250ms',
        }}
      >
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => {
              navigate(item.path);
              if (isMobile) setSidebarOpen(false);
            }}
            selected={isActive(item.path)}
            sx={{
              borderRadius: sidebarOpen ? '12px' : '50%',
              mx: sidebarOpen ? 2 : 'auto',
              p: sidebarOpen ? 1.5 : 1.2,
              minHeight: sidebarOpen ? 'auto' : '48px',
              minWidth: sidebarOpen ? 'auto' : '48px',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              '&:hover': {
                bgcolor: isActive(item.path) ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s',
                boxShadow: isActive(item.path) ? '0 4px 10px rgba(0, 0, 0, 0.15)' : 'none',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path) ? 'white' : 'text.secondary',
                minWidth: sidebarOpen ? 36 : 0,
                mr: sidebarOpen ? 1.5 : 0,
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {sidebarOpen && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 500,
                  fontSize: '0.95rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </Zoom>
    ));
  };

  // Render footer items
  const renderFooterItems = () => {
    return footerNavItems.map(item => (
      <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={item.action}
          sx={{
            borderRadius: sidebarOpen ? '12px' : '50%',
            mx: sidebarOpen ? 2 : 'auto',
            p: sidebarOpen ? 1.5 : 1.2,
            minHeight: sidebarOpen ? 'auto' : '48px',
            minWidth: sidebarOpen ? 'auto' : '48px',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ListItemIcon
            sx={{
              color: 'text.secondary',
              minWidth: sidebarOpen ? 36 : 0,
              mr: sidebarOpen ? 1.5 : 0,
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </ListItemIcon>
          {sidebarOpen && (
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    ));
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
      role="presentation"
    >
      {/* Header */}
      <Box
        sx={{
          p: sidebarOpen ? 3 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              mr: sidebarOpen ? 2 : 0,
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
          >
            V
          </Avatar>
          {sidebarOpen && (
            <Fade in={sidebarOpen}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Vendura
              </Typography>
            </Fade>
          )}
        </Box>
        {!isMobile && (
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'background.default',
                transform: 'scale(1.1)',
              },
              transition: 'transform 0.2s',
            }}
          >
            {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Main Navigation */}
        <Box sx={{ mb: 3 }}>
          {sidebarOpen && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                px: 3,
                mb: 1,
                display: 'block',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Hauptmenü
            </Typography>
          )}
          <List sx={{ pt: 0 }}>{renderNavItems(navigationCategories.main, 'main')}</List>
        </Box>

        {/* Other Navigation */}
        <Box sx={{ mb: 3 }}>
          {sidebarOpen && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                px: 3,
                mb: 1,
                display: 'block',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Weitere
            </Typography>
          )}
          <List sx={{ pt: 0 }}>{renderNavItems(navigationCategories.other, 'other')}</List>
        </Box>

        {/* System Navigation */}
        <Box sx={{ mb: 3 }}>
          {sidebarOpen && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                px: 3,
                mb: 1,
                display: 'block',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              System
            </Typography>
          )}
          <List sx={{ pt: 0 }}>{renderNavItems(navigationCategories.system, 'system')}</List>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mx: 2, mb: 2 }} />
        <List>{renderFooterItems()}</List>
        {sidebarOpen && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Vendura
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for desktop */}
      {!isMobile ? (
        <Paper
          elevation={3}
          sx={{
            width: currentWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
            overflowX: 'hidden',
            borderRadius: 0,
            borderRight: 'none',
            height: '100%',
            position: 'relative',
            zIndex: theme.zIndex.drawer,
          }}
        >
          {drawer}
        </Paper>
      ) : (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={handleSidebarToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarWidth,
              border: 'none',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: theme.zIndex.drawer + 2,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{
                mr: 2,
                bgcolor: 'background.default',
                '&:hover': {
                  bgcolor: 'background.default',
                  transform: 'rotate(180deg)',
                },
                transition: 'transform 0.3s ease-in-out',
                transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: 'text.primary',
                fontWeight: 600,
              }}
            >
              {navigationCategories.main.find(item => isActive(item.path))?.text ||
                navigationCategories.other.find(item => isActive(item.path))?.text ||
                navigationCategories.system.find(item => isActive(item.path))?.text ||
                'Vendura'}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Benachrichtigungen">
                <IconButton
                  sx={{
                    mx: 1,
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                    transition: 'transform 0.2s',
                  }}
                >
                  <Badge
                    badgeContent={4}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        animation: 'pulse 1.5s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'scale(1)',
                          },
                          '50%': {
                            transform: 'scale(1.1)',
                          },
                          '100%': {
                            transform: 'scale(1)',
                          },
                        },
                      },
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Benutzerprofil">
                <IconButton
                  sx={{
                    ml: 1,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                    transition: 'transform 0.2s',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    }}
                  >
                    <AccountCircleIcon fontSize="small" />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Container maxWidth="xl" sx={{ height: '100%' }}>
            <Outlet />
          </Container>
        </Box>

        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Vendura Kassen- und Lagersystem
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
