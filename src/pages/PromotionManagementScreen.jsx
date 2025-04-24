import {
  Box,
  Container,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LocalOffer as LocalOfferIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import { PromotionList, PromotionForm } from '../components/promotions';
import { ProductService, PromotionService } from '../services';
import { useToast } from '../components/ui/feedback';

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
 * @component PromotionManagementScreen
 * @description Handles the display, creation, editing, and deletion of promotions.
 * It fetches promotion and product data, provides filtering capabilities,
 * and manages dialogs for creating/editing and confirming deletion.
 * @returns {React.ReactElement} The Promotion Management Screen component.
 */
const PromotionManagementScreen = () => {
  const theme = useTheme();
  const { showToast } = useToast();

  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    id: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPromotions, setFilteredPromotions] = useState([]);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PromotionService.getPromotions({
        page: 0,
        size: 100,
      });

      const enrichedPromotions = await Promise.all(
        response.content.map(async promo => {
          try {
            const product = await ProductService.getProductById(promo.productId);
            return {
              ...promo,
              productName: product ? product.name : 'Unbekanntes Produkt',
            };
          } catch (error) {
            console.error(`Error fetching product for promotion ${promo.id}:`, error);
            return {
              ...promo,
              productName: 'Produkt nicht gefunden',
            };
          }
        })
      );

      setPromotions(enrichedPromotions);
      setFilteredPromotions(enrichedPromotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setError(error.message || 'Fehler beim Laden der Aktionen');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await ProductService.getProducts({ page: 0, size: 100 });
      setProducts(response.content || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast({
        message: 'Fehler beim Laden der Produkte',
        severity: 'error',
      });
    }
  }, [showToast]);

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, [fetchPromotions, fetchProducts]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPromotions(promotions);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = promotions.filter(promotion =>
      promotion.productName.toLowerCase().includes(lowercaseQuery)
    );

    setFilteredPromotions(filtered);
  }, [searchQuery, promotions]);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleAddClick = useCallback(() => {
    setSelectedPromotion(null);
    setIsEditMode(false);
    setDialogOpen(true);
  }, []);

  const handleEditClick = useCallback(promotion => {
    setSelectedPromotion(promotion);
    setIsEditMode(true);
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (formData, promotionId) => {
      try {
        if (isEditMode) {
          await PromotionService.updatePromotion(promotionId, formData);
          showToast({
            message: 'Aktion erfolgreich aktualisiert',
            severity: 'success',
          });
        } else {
          await PromotionService.createPromotion(formData);
          showToast({
            message: 'Aktion erfolgreich erstellt',
            severity: 'success',
          });
        }
        setDialogOpen(false);
        fetchPromotions();
      } catch (error) {
        console.error('Error saving promotion:', error);
        showToast({
          message: `Fehler beim ${isEditMode ? 'Aktualisieren' : 'Erstellen'} der Aktion: ${error.message}`,
          severity: 'error',
        });
      }
    },
    [isEditMode, showToast, fetchPromotions]
  );

  const handleDeleteClick = useCallback(id => {
    setConfirmDeleteDialog({
      open: true,
      id,
    });
  }, []);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteDialog({
      open: false,
      id: null,
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await PromotionService.deletePromotion(confirmDeleteDialog.id);
      showToast({
        message: 'Aktion erfolgreich gelöscht',
        severity: 'success',
      });
      setConfirmDeleteDialog({ open: false, id: null });
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      showToast({
        message: `Fehler beim Löschen der Aktion: ${error.message}`,
        severity: 'error',
      });
    }
  }, [confirmDeleteDialog.id, showToast, fetchPromotions]);

  const promotionStats = {
    total: promotions.length,
    active: promotions.filter(p => p.active).length,
    upcoming: promotions.filter(p => new Date(p.begin) > new Date()).length,
    expired: promotions.filter(p => new Date(p.end) < new Date() && !p.active).length,
  };

  return (
    <Box sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Aktionen & Rabatte
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Erstellen und verwalten Sie Produkt-Rabatte. Mit Aktionen können Sie Rabatte für
              bestimmte Zeit für ausgewählte Produkte anbieten.
            </Typography>
          </Box>
        </Container>
      </motion.div>

      <Container maxWidth="xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          mr: 2,
                        }}
                      >
                        <LocalOfferIcon color="primary" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Gesamt
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0 }}>
                      {loading ? <CircularProgress size={24} /> : promotionStats.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          mr: 2,
                        }}
                      >
                        <LocalOfferIcon color="success" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Aktiv
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0 }}>
                      {loading ? <CircularProgress size={24} /> : promotionStats.active}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          mr: 2,
                        }}
                      >
                        <LocalOfferIcon color="warning" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Bevorstehend
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0 }}>
                      {loading ? <CircularProgress size={24} /> : promotionStats.upcoming}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          mr: 2,
                        }}
                      >
                        <LocalOfferIcon color="error" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Abgelaufen
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0 }}>
                      {loading ? <CircularProgress size={24} /> : promotionStats.expired}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Suche nach Aktionen..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                  >
                    Neue Aktion
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                minHeight: '50vh',
                borderRadius: 2,
              }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <PromotionList
                promotions={filteredPromotions}
                loading={loading}
                error={error}
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

      <PromotionForm
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
        promotion={selectedPromotion}
        products={products}
        isEditMode={isEditMode}
      />

      <Dialog open={confirmDeleteDialog.open} onClose={handleCancelDelete}>
        <DialogTitle>Aktion löschen</DialogTitle>
        <DialogContent>
          <Typography>
            Sind Sie sicher, dass Sie diese Aktion löschen möchten? Diese Aktion kann nicht
            rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Abbrechen</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionManagementScreen;
