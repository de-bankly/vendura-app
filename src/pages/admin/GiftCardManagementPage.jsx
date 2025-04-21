import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { VoucherManagement } from '../../components/admin';

/**
 * Gift Card Management page for administrators
 */
const GiftCardManagementPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gutschein-Verwaltung
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Hier können Sie Geschenkkarten und Rabattgutscheine erstellen, bearbeiten und verwalten.
        </Typography>

        <VoucherManagement />
      </Box>
    </Container>
  );
};

export default GiftCardManagementPage;
