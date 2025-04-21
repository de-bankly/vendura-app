import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DiscountIcon from '@mui/icons-material/Discount';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Avatar,
  Tooltip,
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
  CircularProgress,
} from '@mui/material';
import { useState, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// Auth context
import { useAuth } from '../../contexts/AuthContext';

// Components
import { ProfileCard } from '../ui/cards';

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

  // State for admin menu
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
  const adminMenuOpen = Boolean(adminMenuAnchorEl);

  // Navigation categories
  const navigationCategories = {
    main: [
      { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
      { text: 'Verkauf', path: '/sales', icon: <PointOfSaleIcon /> },
      { text: 'Inventar', path: '/inventory', icon: <InventoryIcon /> },
      { text: 'Aktionen', path: '/promotions', icon: <DiscountIcon /> },
      { text: 'Gutscheine', path: '/giftcards', icon: <CardGiftcardIcon /> },
      { text: 'Angebote', path: '/vouchers', icon: <LocalOfferIcon /> },
    ],
    admin: isAdmin
      ? [
          { text: 'Benutzer', path: '/admin/users', icon: <GroupIcon /> },
          { text: 'Rollen', path: '/admin/roles', icon: <VpnKeyIcon /> },
          { text: 'Produkte', path: '/admin/products', icon: <ViewModuleIcon /> },
          { text: 'Gutscheine', path: '/admin/giftcards', icon: <CardGiftcardIcon /> },
          { text: 'Aktionen', path: '/admin/promotions', icon: <DiscountIcon /> },
        ]
      : [],
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
        handleUserMenuClose();
      },
    },
    {
      text: 'Hilfe',
      icon: <HelpOutlineIcon />,
      action: () => {
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
          }}
        >
          V
        </Avatar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Vendura
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

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
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path) ? 'white' : 'primary.main',
                minWidth: 36,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {isAdmin && navigationCategories.admin.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, px: 1, fontWeight: 500 }}>
            Administration
          </Typography>

          <List>
            {navigationCategories.admin.map(item => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setMobileDrawerOpen(false);
                }}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'white' : 'primary.main',
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'grey.200',
          bgcolor: 'background.paper',
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Mobile menu icon */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

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
                width: 32,
                height: 32,
                mr: 1,
              }}
            >
              V
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                display: { xs: 'none', sm: 'block' },
                color: 'primary.main',
              }}
            >
              Vendura
            </Typography>
          </Box>

          {/* Desktop navigation */}
          {!isMobile && (
            <Box sx={{ ml: 4, display: 'flex', gap: 0.5 }}>
              {navigationCategories.main.map(item => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '20%',
                      width: isActive(item.path) ? '60%' : '0%',
                      height: '2px',
                      bgcolor: 'primary.main',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '&:after': {
                        width: '60%',
                      },
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}

              {/* Admin dropdown menu - only visible for admins */}
              {isAdmin && navigationCategories.admin.length > 0 && (
                <>
                  <Button
                    color="inherit"
                    onClick={handleAdminMenuOpen}
                    startIcon={<AdminPanelSettingsIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    aria-controls={adminMenuOpen ? 'admin-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={adminMenuOpen ? 'true' : undefined}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      color: location.pathname.startsWith('/admin')
                        ? 'primary.main'
                        : 'text.primary',
                      fontWeight: location.pathname.startsWith('/admin') ? 600 : 400,
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '20%',
                        width: location.pathname.startsWith('/admin') ? '60%' : '0%',
                        height: '2px',
                        bgcolor: 'primary.main',
                        transition: 'width 0.3s ease',
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
                        '&:after': {
                          width: '60%',
                        },
                      },
                    }}
                  >
                    Administration
                  </Button>
                  <Menu
                    id="admin-menu"
                    anchorEl={adminMenuAnchorEl}
                    open={adminMenuOpen}
                    onClose={handleAdminMenuClose}
                    transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 180,
                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                        borderRadius: 1,
                      },
                    }}
                  >
                    {navigationCategories.admin.map(item => (
                      <MenuItem
                        key={item.text}
                        onClick={() => {
                          navigate(item.path);
                          handleAdminMenuClose();
                        }}
                        selected={isActive(item.path)}
                        sx={{
                          py: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          mx: 0.5,
                          borderRadius: 1,
                          '&.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            fontWeight: 600,
                          },
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: 'text.primary', minWidth: 36 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              fontWeight={isActive(item.path) ? 600 : 400}
                            >
                              {item.text}
                            </Typography>
                          }
                        />
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* User Avatar Button */}
          {isLoggedIn ? (
            <Tooltip title="Konto-Einstellungen">
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                aria-controls={userMenuOpen ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuOpen ? 'true' : undefined}
                sx={{
                  ml: 1,
                  border: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.1),
                  p: 0.5,
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  {user?.firstName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
            >
              Anmelden
            </Button>
          )}

          {/* User Menu */}
          <Menu
            id="user-menu"
            anchorEl={userMenuAnchorEl}
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                borderRadius: 1,
              },
            }}
          >
            <ProfileCard user={user} />

            <Divider />

            {userMenuItems.map(item => (
              <MenuItem
                key={item.text}
                onClick={item.action}
                sx={{
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  mx: 0.5,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'text.primary', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {item.text}
                    </Typography>
                  }
                />
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 280 },
        }}
      >
        {mobileDrawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 9 },
          pb: 3,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%' }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'calc(100vh - 120px)',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Outlet />
          </Suspense>
        </Container>
      </Box>
    </Box>
  );
};

export default TopNavLayout;
