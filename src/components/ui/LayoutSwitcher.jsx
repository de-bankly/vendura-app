import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Box, Tooltip } from '@mui/material';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';

/**
 * LayoutSwitcher component
 * Allows users to switch between sidebar and top navigation layouts
 */
const LayoutSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're currently using the sidebar layout
  const isSidebarLayout = location.pathname.startsWith('/sidebar');

  // Get the current path without the /sidebar prefix
  const getPathWithoutPrefix = () => {
    if (isSidebarLayout) {
      // Remove /sidebar prefix
      return location.pathname.replace('/sidebar', '') || '/';
    } else {
      // Add /sidebar prefix
      return `/sidebar${location.pathname === '/' ? '' : location.pathname}`;
    }
  };

  const handleLayoutSwitch = () => {
    navigate(getPathWithoutPrefix());
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Tooltip
        title={isSidebarLayout ? 'Zur Top-Navigation wechseln' : 'Zur Sidebar-Navigation wechseln'}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleLayoutSwitch}
          sx={{
            borderRadius: '50%',
            minWidth: '56px',
            width: '56px',
            height: '56px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {isSidebarLayout ? <ViewAgendaIcon /> : <ViewSidebarIcon />}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default LayoutSwitcher;
