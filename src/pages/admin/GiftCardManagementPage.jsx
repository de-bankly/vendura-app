import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';

import { GiftCardService } from '../../services';

/**
 * GiftCardManagementPage - Admin page to manage gift cards
 */
const GiftCardManagementPage = () => {
  // State for gift cards
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form states
  const [currentGiftCard, setCurrentGiftCard] = useState({
    code: '',
    initialValue: 0,
    remainingBalance: 0,
  });

  // Fetch gift cards
  const fetchGiftCards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GiftCardService.getGiftCards({
        page,
        size: rowsPerPage,
      });

      setGiftCards(response.content || []);
      setTotalElements(response.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching gift cards:', err);
      setError('Fehler beim Laden der Gutscheinkarten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Load gift cards on component mount and when pagination changes
  useEffect(() => {
    fetchGiftCards();
  }, [fetchGiftCards]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle form input change
  const handleInputChange = e => {
    const { name, value } = e.target;

    // Convert numeric values
    const parsedValue =
      name === 'initialValue' || name === 'remainingBalance' ? parseFloat(value) || 0 : value;

    setCurrentGiftCard({
      ...currentGiftCard,
      [name]: parsedValue,
    });
  };

  // Open create dialog
  const handleOpenCreateDialog = () => {
    setCurrentGiftCard({
      code: '',
      initialValue: 0,
      remainingBalance: 0,
    });
    setOpenCreateDialog(true);
  };

  // Close create dialog
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  // Open edit dialog
  const handleOpenEditDialog = giftCard => {
    setCurrentGiftCard({
      ...giftCard,
    });
    setOpenEditDialog(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = giftCard => {
    setCurrentGiftCard(giftCard);
    setOpenDeleteDialog(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Create gift card
  const handleCreateGiftCard = async () => {
    try {
      setLoading(true);
      await GiftCardService.createGiftCard(currentGiftCard);
      handleCloseCreateDialog();
      fetchGiftCards();
    } catch (err) {
      console.error('Error creating gift card:', err);
      setError('Fehler beim Erstellen der Gutscheinkarte. Bitte versuchen Sie es später erneut.');
      setLoading(false);
    }
  };

  // Update gift card
  const handleUpdateGiftCard = async () => {
    try {
      setLoading(true);
      await GiftCardService.updateGiftCard(currentGiftCard.id, currentGiftCard);
      handleCloseEditDialog();
      fetchGiftCards();
    } catch (err) {
      console.error('Error updating gift card:', err);
      setError(
        'Fehler beim Aktualisieren der Gutscheinkarte. Bitte versuchen Sie es später erneut.'
      );
      setLoading(false);
    }
  };

  // Delete gift card
  const handleDeleteGiftCard = async () => {
    try {
      setLoading(true);
      await GiftCardService.deleteGiftCard(currentGiftCard.id);
      handleCloseDeleteDialog();
      fetchGiftCards();
    } catch (err) {
      console.error('Error deleting gift card:', err);
      setError('Fehler beim Löschen der Gutscheinkarte. Bitte versuchen Sie es später erneut.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gutscheinkarten-Verwaltung
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          disabled={loading}
        >
          Neue Gutscheinkarte
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {loading && giftCards.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell align="right">Anfangswert (€)</TableCell>
                      <TableCell align="right">Aktueller Wert (€)</TableCell>
                      <TableCell align="center">Aktionen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {giftCards.map(giftCard => (
                      <TableRow key={giftCard.id}>
                        <TableCell>{giftCard.id}</TableCell>
                        <TableCell>{giftCard.code}</TableCell>
                        <TableCell align="right">
                          {(giftCard.initialValue ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {(giftCard.remainingBalance ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditDialog(giftCard)}
                            disabled={loading}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(giftCard)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                    {giftCards.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Keine Gutscheinkarten gefunden
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Zeilen pro Seite:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
                disabled={loading}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Neue Gutscheinkarte erstellen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="code"
            label="Code"
            fullWidth
            variant="outlined"
            value={currentGiftCard.code}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="initialValue"
            label="Wert (€)"
            type="number"
            fullWidth
            variant="outlined"
            value={currentGiftCard.initialValue}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Abbrechen</Button>
          <Button
            onClick={handleCreateGiftCard}
            variant="contained"
            disabled={!currentGiftCard.code || currentGiftCard.initialValue <= 0}
          >
            Erstellen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Gutscheinkarte bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="code"
            label="Code"
            fullWidth
            variant="outlined"
            value={currentGiftCard.code}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="initialValue"
            label="Anfangswert (€)"
            type="number"
            fullWidth
            variant="outlined"
            value={currentGiftCard.initialValue}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            margin="dense"
            name="remainingBalance"
            label="Aktueller Wert (€)"
            type="number"
            fullWidth
            variant="outlined"
            value={currentGiftCard.remainingBalance}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Abbrechen</Button>
          <Button
            onClick={handleUpdateGiftCard}
            variant="contained"
            disabled={!currentGiftCard.code || currentGiftCard.initialValue <= 0}
          >
            Aktualisieren
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Gutscheinkarte löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sind Sie sicher, dass Sie die Gutscheinkarte mit dem Code "{currentGiftCard.code}"
            löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Abbrechen</Button>
          <Button onClick={handleDeleteGiftCard} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GiftCardManagementPage;
