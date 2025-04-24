import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CardGiftcard as CardGiftcardIcon,
  Add as AddIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { VoucherManagement } from '../../components/admin';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/**
 * Gift Card Management page for administrators
 */
const GiftCardManagementPage = () => {
  const theme = useTheme();
  const voucherManagementRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    type: 'GIFT_CARD',
    editMode: false,
  });

  // Handle opening the voucher creation dialog for gift cards
  const handleCreateGiftCard = () => {
    setDialogConfig({
      type: 'GIFT_CARD',
      editMode: false,
    });
    setOpenDialog(true);
  };

  // Handle opening the voucher creation dialog for discount cards
  const handleCreateDiscountCard = () => {
    setDialogConfig({
      type: 'DISCOUNT_CARD',
      editMode: false,
    });
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="xl">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 3, mt: 1 }}>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background:
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <CardGiftcardIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.primary.main,
                      }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Gutschein-Verwaltung
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Erstellen und verwalten Sie Geschenkkarten und Rabattgutscheine
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: theme.palette.primary.main,
                  },
                }}
              >
                <CardContent sx={{ height: '100%', p: 3 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <CardGiftcardIcon color="primary" sx={{ fontSize: 32 }} />
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6" gutterBottom>
                        Geschenkkarten
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Verwalten Sie Geschenkkarten mit flexiblen Guthaben-Optionen
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                        onClick={handleCreateGiftCard}
                      >
                        Neue Geschenkkarte
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: theme.palette.secondary.main,
                  },
                }}
              >
                <CardContent sx={{ height: '100%', p: 3 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: alpha(theme.palette.secondary.main, 0.1),
                        }}
                      >
                        <LocalOfferIcon color="secondary" sx={{ fontSize: 32 }} />
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6" gutterBottom>
                        Rabattgutscheine
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Erstellen Sie Rabattgutscheine mit prozentualen Rabatten
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                        onClick={handleCreateDiscountCard}
                      >
                        Neuer Rabattgutschein
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Main Content Section */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              p: 3,
            }}
          >
            <VoucherManagement
              ref={voucherManagementRef}
              initialOpenDialog={openDialog}
              initialDialogConfig={dialogConfig}
              onCloseDialog={handleCloseDialog}
            />
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default GiftCardManagementPage;
