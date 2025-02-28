import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import BugReportIcon from '@mui/icons-material/BugReport';
import ErrorIcon from '@mui/icons-material/Error';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigationItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'About', path: '/about', icon: <InfoIcon /> },
    { text: 'Component Showcase', path: '/showcase', icon: <ViewModuleIcon /> },
    { text: 'Error Test', path: '/error-test', icon: <BugReportIcon /> },
    { text: 'Route Error', path: '/error-page', icon: <ErrorIcon /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isActive = path => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary">
          Vendura App
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map(item => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setDrawerOpen(false);
              }}
              selected={isActive(item.path)}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vendura
          </Typography>
          {!isMobile &&
            navigationItems.map(item => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  borderBottom: isActive(item.path) ? '2px solid white' : 'none',
                }}
              >
                {item.text}
              </Button>
            ))}
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme => theme.palette.grey[100],
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Vendura Banking App
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;
