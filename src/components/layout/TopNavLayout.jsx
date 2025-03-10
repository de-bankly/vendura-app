import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Avatar,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import InfoIcon from '@mui/icons-material/Info';
import BugReportIcon from '@mui/icons-material/BugReport';
import ErrorIcon from '@mui/icons-material/Error';

// Components
import LayoutSwitcher from '../ui/LayoutSwitcher';

const TopNavLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for mobile drawer
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // State for user menu
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  // State for notifications menu
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const notificationsMenuOpen = Boolean(notificationsAnchorEl);

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
  const userMenuItems = [
    {
      text: 'Profil',
      icon: <AccountCircleIcon />,
      action: () => {
        console.log('Profile clicked');
        handleUserMenuClose();
      },
    },
    {
      text: 'Einstellungen',
      icon: <SettingsIcon />,
      action: () => {
        console.log('Settings clicked');
        handleUserMenuClose();
      },
    },
    {
      text: 'Hilfe',
      icon: <HelpOutlineIcon />,
      action: () => {
        console.log('Help clicked');
        handleUserMenuClose();
      },
    },
    {
      text: 'Abmelden',
      icon: <LogoutIcon />,
      action: () => {
        console.log('Logout clicked');
        handleUserMenuClose();
      },
    },
  ];

  const isActive = path => {
    return location.pathname === path;
  };

  // Handle mobile drawer toggle
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Handle user menu
  const handleUserMenuOpen = event => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // Handle notifications menu
  const handleNotificationsOpen = event => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  // Mobile drawer content
  const mobileDrawerContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
            mr: 2,
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          V
        </Avatar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Vendura
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
        Hauptmenü
      </Typography>
      <List>
        {navigationCategories.main.map(item => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
            }}
            selected={isActive(item.path)}
            sx={{
              borderRadius: '8px',
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        Weitere
      </Typography>
      <List>
        {navigationCategories.other.map(item => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
            }}
            selected={isActive(item.path)}
            sx={{
              borderRadius: '8px',
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        System
      </Typography>
      <List>
        {navigationCategories.system.map(item => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
            }}
            selected={isActive(item.path)}
            sx={{
              borderRadius: '8px',
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="sticky" elevation={1} color="default" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 36,
                height: 36,
                mr: 1.5,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              V
            </Avatar>
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Vendura
            </Typography>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {navigationCategories.main.map(item => (
              <Button
                key={item.text}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                color={isActive(item.path) ? 'primary' : 'inherit'}
                variant={isActive(item.path) ? 'contained' : 'text'}
                sx={{
                  mx: 0.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  '&:hover': {
                    backgroundColor: isActive(item.path) ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Notifications */}
            <Tooltip title="Benachrichtigungen">
              <IconButton
                onClick={handleNotificationsOpen}
                size="large"
                aria-controls={notificationsMenuOpen ? 'notifications-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={notificationsMenuOpen ? 'true' : undefined}
                sx={{
                  mx: 1,
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

            {/* User Menu */}
            <Tooltip title="Benutzerprofil">
              <IconButton
                onClick={handleUserMenuOpen}
                size="large"
                aria-controls={userMenuOpen ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuOpen ? 'true' : undefined}
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

        {/* Secondary Navigation for Desktop */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            bgcolor: 'background.default',
            px: 2,
            py: 0.5,
            borderTop: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          {[...navigationCategories.other, ...navigationCategories.system].map(item => (
            <Button
              key={item.text}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              color={isActive(item.path) ? 'primary' : 'inherit'}
              size="small"
              sx={{
                mx: 0.5,
                textTransform: 'none',
                fontWeight: isActive(item.path) ? 600 : 400,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
                color: isActive(item.path) ? 'primary.main' : 'text.secondary',
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        id="notifications-menu"
        anchorEl={notificationsAnchorEl}
        open={notificationsMenuOpen}
        onClose={handleNotificationsClose}
        MenuListProps={{
          'aria-labelledby': 'notifications-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            width: 320,
            maxHeight: 400,
            overflow: 'auto',
            borderRadius: '12px',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Benachrichtigungen
          </Typography>
          <Divider />
          <List sx={{ py: 0 }}>
            {[1, 2, 3, 4].map(item => (
              <ListItem key={item} sx={{ py: 1.5 }}>
                <ListItemText
                  primary={`Benachrichtigung ${item}`}
                  secondary={`Dies ist eine Beispielbenachrichtigung ${item}`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Menu>

      {/* User Menu */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchorEl}
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        MenuListProps={{
          'aria-labelledby': 'user-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: '12px',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Max Mustermann
          </Typography>
          <Typography variant="body2" color="text.secondary">
            max@example.com
          </Typography>
        </Box>
        <Divider />
        {userMenuItems.map(item => (
          <MenuItem
            key={item.text}
            onClick={item.action}
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        {mobileDrawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.default',
          overflow: 'auto',
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Layout Switcher */}
      <LayoutSwitcher />

      {/* Footer */}
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
  );
};

export default TopNavLayout;
