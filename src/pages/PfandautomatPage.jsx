import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PfandautomatView from '../components/deposit/PfandautomatView';

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
