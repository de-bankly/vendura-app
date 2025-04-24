import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PfandautomatView from '../components/deposit/PfandautomatView';

/**
 * Renders the Pfandautomat page, displaying the PfandautomatView component
 * wrapped in a Suspense component to handle loading states.
 *
 * @returns {JSX.Element} The Pfandautomat page component.
 */
const PfandautomatPage = () => {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      }
    >
      <PfandautomatView />
    </Suspense>
  );
};

export default PfandautomatPage;
