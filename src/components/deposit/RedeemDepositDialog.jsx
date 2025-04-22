import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  IconButton,
  Avatar,
  alpha,
  useTheme,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import DepositService from '../../services/DepositService';

/**
 * Dialog component for validating deposit receipts and adding them to the cart
 */
const RedeemDepositDialog = ({ open, onClose, onDepositRedeemed, appliedDepositIds = [] }) => {
  const theme = useTheme();
  const [depositId, setDepositId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validatedReceipt, setValidatedReceipt] = useState(null);
  const [applied, setApplied] = useState(false);

  // Reset state when dialog is opened/closed
  React.useEffect(() => {
    if (!open) {
      // Reset only when dialog is closed
      setDepositId('');
      setError(null);
      setValidatedReceipt(null);
      setApplied(false);
    }
  }, [open]);

  // Handle deposit ID change
  const handleDepositIdChange = event => {
    setDepositId(event.target.value.trim());
    setError(null);
  };

  // Handle deposit receipt validation
  const handleValidateDeposit = async () => {
    if (!depositId.trim()) {
      setError('Bitte geben Sie eine Pfand-Belegnummer ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await DepositService.getDepositReceiptById(depositId);
      const receipt = response.data;

      if (receipt.redeemed) {
        setError('Dieser Pfandbeleg wurde bereits eingelöst');
        setValidatedReceipt(null);
      } else if (appliedDepositIds.includes(receipt.id)) {
        setError('Dieser Pfandbeleg wurde bereits diesem Warenkorb hinzugefügt');
        setValidatedReceipt(null);
      } else {
        setValidatedReceipt(receipt);
      }
    } catch (err) {
      setError('Pfandbeleg nicht gefunden oder ungültig');
      setValidatedReceipt(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle deposit application to cart
  const handleApplyDeposit = () => {
    setApplied(true);
    if (onDepositRedeemed) {
      onDepositRedeemed({
        id: validatedReceipt.id,
        value: validatedReceipt.total,
        positions: validatedReceipt.positions,
        redeemed: false, // The receipt is not actually redeemed yet
      });
    }
  };

  // Format currency
  const formatCurrency = amount => {
    return amount.toFixed(2) + ' €';
  };

  // Handle dialog close
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
          color: 'white',
          py: 2.5,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.2),
                color: 'white',
                width: 42,
                height: 42,
                mr: 2,
                boxShadow: theme.shadows[3],
              }}
            >
              <ReceiptIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Pfandbeleg einlösen
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            onClick={handleClose}
            size="large"
            sx={{
              bgcolor: alpha(theme.palette.common.white, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.common.white, 0.2),
              },
            }}
            aria-label="Schließen"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {applied ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              textAlign: 'center',
              py: 3,
              px: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="success.main">
              Pfandbeleg hinzugefügt!
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Der Pfandbeleg im Wert von {formatCurrency(validatedReceipt.total)} wurde erfolgreich
              zum Warenkorb hinzugefügt.
            </Typography>
            <Chip
              label={`Beleg-Nr: ${validatedReceipt.id}`}
              color="success"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
        ) : (
          <>
            <Typography variant="body1" paragraph>
              Bitte geben Sie die Belegnummer Ihres Pfandbelegs ein, um diesen einzulösen und den
              Betrag auf Ihren aktuellen Einkauf anzuwenden.
            </Typography>

            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                display: 'flex',
                mb: 3,
                mt: 2,
              }}
            >
              <TextField
                autoFocus
                label="Pfand-Belegnummer"
                fullWidth
                value={depositId}
                onChange={handleDepositIdChange}
                variant="outlined"
                sx={{
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleValidateDeposit}
                disabled={loading || !depositId.trim()}
                sx={{
                  minWidth: '120px',
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Prüfen'}
              </Button>
            </Box>

            {error && (
              <Alert
                severity="error"
                variant="filled"
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {validatedReceipt && (
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                variant="outlined"
                sx={{
                  p: 3,
                  mt: 2,
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.success.main, 0.3),
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      mr: 2,
                    }}
                  >
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Pfandbeleg gefunden
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Beleg-Nr: {validatedReceipt.id}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: 'success.main' }}
                >
                  Pfandartikel:
                </Typography>
                <TableContainer
                  component={Box}
                  sx={{
                    mb: 2,
                    '& .MuiTableCell-root': {
                      borderColor: alpha(theme.palette.success.main, 0.2),
                    },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
                        <TableCell>Artikel</TableCell>
                        <TableCell align="center">Anzahl</TableCell>
                        <TableCell align="right">Pfand</TableCell>
                        <TableCell align="right">Summe</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {validatedReceipt.positions.map((position, index) => (
                        <TableRow key={index}>
                          <TableCell>{position.product.name}</TableCell>
                          <TableCell align="center">{position.quantity}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(position.product.price)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(position.product.price * position.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Gesamtbetrag:
                  </Typography>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    {formatCurrency(validatedReceipt.total)}
                  </Typography>
                </Box>
              </Paper>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: theme.palette.background.default,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={handleClose}
          color="inherit"
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 2,
          }}
        >
          {applied ? 'Schließen' : 'Abbrechen'}
        </Button>

        {validatedReceipt && !applied && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleApplyDeposit}
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              disabled={loading}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 2,
                boxShadow: 3,
                minWidth: 200,
                '&:hover': {
                  boxShadow: 5,
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Zum Warenkorb hinzufügen'}
            </Button>
          </motion.div>
        )}
      </DialogActions>
    </Dialog>
  );
};

RedeemDepositDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDepositRedeemed: PropTypes.func,
  appliedDepositIds: PropTypes.arrayOf(PropTypes.string),
};

export default RedeemDepositDialog;
