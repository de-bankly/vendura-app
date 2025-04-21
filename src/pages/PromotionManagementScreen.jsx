import {
  Container,
  Paper,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';

import { PromotionList, PromotionForm } from '../components/promotions';
import { ProductService, PromotionService } from '../services';
import { useToast } from '../components/ui/feedback';

/**
 * PromotionManagementScreen handles the creation, editing and deletion of promotions
 */
const PromotionManagementScreen = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({ open: false, id: null });

  const { showToast } = useToast();

  // Fetch all promotions
  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PromotionService.getPromotions({ page: 0, size: 100 });

      // Get product details for each promotion
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
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setError(error.message || 'Fehler beim Laden der Aktionen');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all products for the product selector
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

  // Initial data loading
  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, [fetchPromotions, fetchProducts]);

  // Open dialog for creating a new promotion
  const handleAddClick = useCallback(() => {
    setSelectedPromotion(null);
    setIsEditMode(false);
    setDialogOpen(true);
  }, []);

  // Open dialog for editing an existing promotion
  const handleEditClick = useCallback(promotion => {
    setSelectedPromotion(promotion);
    setIsEditMode(true);
    setDialogOpen(true);
  }, []);

  // Close the promotion form dialog
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (formData, promotionId) => {
      try {
        console.log('Handling promotion submit:', { isEditMode, promotionId, formData });
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
        // Close dialog and refresh promotions
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

  // Open confirmation dialog before deleting
  const handleDeleteClick = useCallback(id => {
    setConfirmDeleteDialog({
      open: true,
      id,
    });
  }, []);

  // Cancel delete operation
  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteDialog({
      open: false,
      id: null,
    });
  }, []);

  // Confirm and perform delete operation
  const handleConfirmDelete = useCallback(async () => {
    try {
      await PromotionService.deletePromotion(confirmDeleteDialog.id);
      showToast({
        message: 'Aktion erfolgreich gelöscht',
        severity: 'success',
      });
      // Close dialog and refresh promotions
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Aktionen & Rabatte verwalten
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Erstellen und verwalten Sie Produkt-Rabatte. Mit Aktionen können Sie Rabatte für
            bestimmte Zeit für ausgewählte Produkte anbieten.
          </Typography>
        </Box>

        <PromotionList
          promotions={promotions}
          loading={loading}
          error={error}
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />

        {/* Promotion Form Dialog */}
        <PromotionForm
          open={dialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          promotion={selectedPromotion}
          products={products}
          isEditMode={isEditMode}
        />

        {/* Confirm Delete Dialog */}
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
      </Paper>
    </Container>
  );
};

export default PromotionManagementScreen;
