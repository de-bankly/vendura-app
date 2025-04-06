import { useState, useEffect } from 'react';
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
  alpha,
  Paper,
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import BugReportIcon from '@mui/icons-material/BugReport';
import ErrorIcon from '@mui/icons-material/Error';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';

// Auth context
import { useAuth } from '../../contexts/AuthContext';

const TopNavLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Auth context
  const { user, isLoggedIn, logout, isAdmin } = useAuth();

  // State for mobile drawer
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // State for user menu
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  // State for notifications menu
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const notificationsMenuOpen = Boolean(notificationsAnchorEl);

  // State for admin menu
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
  const adminMenuOpen = Boolean(adminMenuAnchorEl);

  // Navigation categories
  const navigationCategories = {
    main: [
      { text: 'Home', path: '/', icon: <ViewModuleIcon /> },
      { text: 'Verkauf', path: '/sales', icon: <PointOfSaleIcon /> },
    ],
    admin: [
      { text: 'Benutzerverwaltung', path: '/admin/users', icon: <GroupIcon /> },
      { text: 'Rollenverwaltung', path: '/admin/roles', icon: <VpnKeyIcon /> },
    ],
    other: [{ text: 'Component Showcase', path: '/showcase', icon: <ViewModuleIcon /> }],
    system: [
      { text: 'Error Test', path: '/error-test', icon: <BugReportIcon /> },
      { text: 'Route Error', path: '/error-page', icon: <ErrorIcon /> },
    ],
  };

  // User menu items
  const userMenuItems = [
    {
      text: 'Profil',
      icon: <PersonIcon />,
      action: () => {
        navigate('/profile');
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
        logout();
        navigate('/login');
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

  // Handle admin menu
  const handleAdminMenuOpen = event => {
    setAdminMenuAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
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
            boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.25)',
            background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
          }}
        >
          V
        </Avatar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Vendura
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, pl: 1 }}>
        Hauptmenü
      </Typography>
      <List>
        {navigationCategories.main.map(item => (
          <ListItem
            button={true}
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
            }}
            selected={isActive(item.path)}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.25)',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              '&:hover': {
                bgcolor: isActive(item.path)
                  ? 'primary.dark'
                  : alpha(theme.palette.primary.main, 0.08),
                transform: 'translateY(-2px)',
                boxShadow: isActive(item.path)
                  ? '0px 6px 16px rgba(37, 99, 235, 0.3)'
                  : '0px 4px 12px rgba(37, 99, 235, 0.1)',
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

      {isLoggedIn() && isAdmin() && (
        <>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mt: 2, mb: 1, fontWeight: 600, pl: 1 }}
          >
            Administration
          </Typography>
          <List>
            {navigationCategories.admin.map(item => (
              <ListItem
                button={true}
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setMobileDrawerOpen(false);
                }}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.25)',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    bgcolor: isActive(item.path)
                      ? 'primary.dark'
                      : alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateY(-2px)',
                    boxShadow: isActive(item.path)
                      ? '0px 6px 16px rgba(37, 99, 235, 0.3)'
                      : '0px 4px 12px rgba(37, 99, 235, 0.1)',
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
        </>
      )}

      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mt: 2, mb: 1, fontWeight: 600, pl: 1 }}
      >
        Weitere
      </Typography>
      <List>
        {navigationCategories.other.map(item => (
          <ListItem
            button={true}
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
            }}
            selected={isActive(item.path)}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.25)',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              '&:hover': {
                bgcolor: isActive(item.path)
                  ? 'primary.dark'
                  : alpha(theme.palette.primary.main, 0.08),
                transform: 'translateY(-2px)',
                boxShadow: isActive(item.path)
                  ? '0px 6px 16px rgba(37, 99, 235, 0.3)'
                  : '0px 4px 12px rgba(37, 99, 235, 0.1)',
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

      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mt: 2, mb: 1, fontWeight: 600, pl: 1 }}
      >
        System
      </Typography>
      <List>
        {navigationCategories.system.map(item => (
          <ListItem
            button={true}
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
            }}
            selected={isActive(item.path)}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.25)',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              '&:hover': {
                bgcolor: isActive(item.path)
                  ? 'primary.dark'
                  : alpha(theme.palette.primary.main, 0.08),
                transform: 'translateY(-2px)',
                boxShadow: isActive(item.path)
                  ? '0px 6px 16px rgba(37, 99, 235, 0.3)'
                  : '0px 4px 12px rgba(37, 99, 235, 0.1)',
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
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu button */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 30,
                  height: 30,
                  mr: 1,
                  boxShadow: '0px 2px 8px rgba(37, 99, 235, 0.25)',
                  background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                V
              </Avatar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                }}
              >
                Vendura
              </Typography>
            </Box>

            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {navigationCategories.main.map(item => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 0.5,
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '3px',
                      bottom: 0,
                      left: 0,
                      backgroundColor: 'primary.main',
                      borderRadius: '4px 4px 0 0',
                      transform: isActive(item.path) ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '&::after': {
                        transform: 'scaleX(1)',
                      },
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}

              {isLoggedIn() && isAdmin() && (
                <Box>
                  <Button
                    onClick={handleAdminMenuOpen}
                    sx={{
                      mx: 0.5,
                      color: location.pathname.startsWith('/admin')
                        ? 'primary.main'
                        : 'text.primary',
                      fontWeight: location.pathname.startsWith('/admin') ? 600 : 400,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '3px',
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'primary.main',
                        borderRadius: '4px 4px 0 0',
                        transform: location.pathname.startsWith('/admin')
                          ? 'scaleX(1)'
                          : 'scaleX(0)',
                        transition: 'transform 0.2s ease-in-out',
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
                        '&::after': {
                          transform: 'scaleX(1)',
                        },
                      },
                    }}
                    endIcon={<AdminPanelSettingsIcon />}
                  >
                    Administration
                  </Button>
                  <Menu
                    anchorEl={adminMenuAnchorEl}
                    open={adminMenuOpen}
                    onClose={handleAdminMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {navigationCategories.admin.map(item => (
                      <MenuItem
                        key={item.text}
                        onClick={() => {
                          navigate(item.path);
                          handleAdminMenuClose();
                        }}
                        sx={{
                          minWidth: 180,
                          borderLeft: isActive(item.path) ? '4px solid' : 'none',
                          borderColor: 'primary.main',
                          backgroundColor: isActive(item.path)
                            ? alpha(theme.palette.primary.main, 0.1)
                            : 'inherit',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: isActive(item.path) ? 600 : 400,
                            color: isActive(item.path) ? 'primary.main' : 'inherit',
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
            </Box>

            {/* Right side icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Notifications icon */}
              <Tooltip title="Benachrichtigungen">
                <IconButton onClick={handleNotificationsOpen} size="large" color="inherit">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Notifications menu */}
              <Menu
                anchorEl={notificationsAnchorEl}
                open={notificationsMenuOpen}
                onClose={handleNotificationsClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Paper sx={{ width: 320, maxHeight: 340, overflow: 'auto' }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6">Benachrichtigungen</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sie haben 3 ungelesene Nachrichten
                    </Typography>
                  </Box>
                  <MenuItem onClick={handleNotificationsClose}>Bestellung #1234 erhalten</MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>
                    Neues Produkt wurde hinzugefügt
                  </MenuItem>
                  <MenuItem onClick={handleNotificationsClose}>Zahlungseingang bestätigt</MenuItem>
                  <Box
                    sx={{
                      p: 1,
                      textAlign: 'center',
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Button size="small" onClick={handleNotificationsClose}>
                      Alle anzeigen
                    </Button>
                  </Box>
                </Paper>
              </Menu>

              {/* User account */}
              {isLoggedIn() ? (
                <>
                  <Tooltip title="Benutzerkonto">
                    <IconButton
                      onClick={handleUserMenuOpen}
                      size="large"
                      edge="end"
                      color="inherit"
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {user?.firstName?.charAt(0) || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={userMenuAnchorEl}
                    open={userMenuOpen}
                    onClose={handleUserMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user?.firstName} {user?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.username}
                      </Typography>
                    </Box>
                    <Divider />
                    {userMenuItems.map(item => (
                      <MenuItem key={item.text} onClick={item.action} sx={{ minWidth: 180 }}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate('/login')}
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
          },
        }}
      >
        {mobileDrawerContent}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </>
  );
};

export default TopNavLayout;
