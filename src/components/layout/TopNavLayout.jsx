import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DiscountIcon from '@mui/icons-material/Discount';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Suspense, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import ProfileCard from '../ui/cards/ProfileCard';

/**
 * Renders the main application layout including the top navigation bar,
 * user/admin menus, a mobile drawer, and the main content area via <Outlet>.
 * Handles responsive behavior and authentication state display.
 * @returns {JSX.Element} The rendered top navigation layout component.
 */
const TopNavLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, isLoggedIn, logout, isAdmin } = useAuth();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const userMenuOpen = Boolean(userMenuAnchorEl);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
  const adminMenuOpen = Boolean(adminMenuAnchorEl);

  /**
   * Defines the structure and content for navigation links, categorized by 'main' and 'admin'.
   * Admin links are only included if the user is an admin.
   * @type {{main: Array<{text: string, path: string, icon: JSX.Element}>, admin: Array<{text: string, path: string, icon: JSX.Element}>}}
   */
  const navigationCategories = {
    main: [
      { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
      { text: 'Verkauf', path: '/sales', icon: <PointOfSaleIcon /> },
      { text: 'Pfandautomat', path: '/deposit', icon: <RecyclingIcon /> },
      { text: 'Inventar', path: '/inventory', icon: <InventoryIcon /> },
    ],
    admin: isAdmin
      ? [
          { text: 'Benutzer', path: '/admin/users', icon: <GroupIcon /> },
          { text: 'Rollen', path: '/admin/roles', icon: <VpnKeyIcon /> },
          {
            text: 'Produkte',
            path: '/admin/products',
            icon: <ViewModuleIcon />,
          },
          {
            text: 'Gutscheine',
            path: '/admin/giftcards',
            icon: <CardGiftcardIcon />,
          },
          {
            text: 'Aktionen',
            path: '/admin/promotions',
            icon: <DiscountIcon />,
          },
        ]
      : [],
  };

  /**
   * Defines the items available in the user dropdown menu.
   * @type {Array<{text: string, icon: JSX.Element, action: function(): void}>}
   */
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
      text: 'Abmelden',
      icon: <LogoutIcon />,
      action: () => {
        logout();
        navigate('/login');
        handleUserMenuClose();
      },
    },
  ];

  /**
   * Checks if the given path matches the current location pathname.
   * @param {string} path - The path to check against the current location.
   * @returns {boolean} True if the path matches the current location, false otherwise.
   */
  const isActive = path => {
    return location.pathname === path;
  };

  /**
   * Toggles the visibility state of the mobile navigation drawer.
   */
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  /**
   * Opens the user menu by setting its anchor element.
   * @param {React.MouseEvent<HTMLElement>} event - The mouse event that triggered the opening.
   */
  const handleUserMenuOpen = event => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  /**
   * Closes the user menu by resetting its anchor element.
   */
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  /**
   * Opens the admin menu by setting its anchor element.
   * @param {React.MouseEvent<HTMLElement>} event - The mouse event that triggered the opening.
   */
  const handleAdminMenuOpen = event => {
    setAdminMenuAnchorEl(event.currentTarget);
  };

  /**
   * Closes the admin menu by resetting its anchor element.
   */
  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
  };

  const mobileDrawerContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          cursor: 'pointer',
        }}
        onClick={() => {
          navigate('/');
          handleMobileDrawerToggle();
        }}
      >
        <PointOfSaleIcon sx={{ mr: 1.5, fontSize: 30, color: 'primary.main' }} />
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

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <PointOfSaleIcon sx={{ mr: 1, fontSize: 28, color: 'primary.main' }} />
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
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 32,
                    height: 32,
                    boxShadow: userMenuOpen
                      ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                      : 'none',
                  }}
                >
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
              sx={{
                borderRadius: 1.5,
                transition: 'all 0.2s ease-in-out',
                fontWeight: 500,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
                },
              }}
            >
              Anmelden
            </Button>
          )}

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
                minWidth: 240,
                overflow: 'visible',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.15)',
                borderRadius: 2,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: -5,
                  right: 16,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <ProfileCard user={user} />

            <Divider sx={{ my: 1 }} />

            {userMenuItems.map(item => (
              <MenuItem
                key={item.text}
                onClick={item.action}
                sx={{
                  py: 1.5,
                  mx: 1,
                  my: 0.5,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      item.text === 'Abmelden'
                        ? theme.palette.error.main
                        : theme.palette.primary.main,
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color={item.text === 'Abmelden' ? 'error' : 'textPrimary'}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 280 },
        }}
      >
        {mobileDrawerContent}
      </Drawer>

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
