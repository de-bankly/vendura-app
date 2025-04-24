import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Stack, Box, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../ui/buttons';
import { motion } from 'framer-motion';

/**
 * Renders action buttons for the shopping cart based on its state.
 * Displays payment button or receipt/new transaction buttons.
 * Also shows messages if the cart is empty or locked.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.receiptReady - Indicates if the receipt is ready for printing.
 * @param {boolean} props.cartIsEmpty - Indicates if the cart currently has no items.
 * @param {boolean} [props.cartLocked] - Indicates if the cart is locked.
 * @param {function} props.onPayment - Callback function triggered when the payment button is clicked.
 * @param {function} props.onPrintReceipt - Callback function triggered when the print receipt button is clicked.
 * @param {function} props.onNewTransaction - Callback function triggered when the new transaction button is clicked.
 * @returns {React.ReactElement} The rendered action buttons component.
 */
const CartActionButtons = ({
  receiptReady,
  cartIsEmpty,
  cartLocked,
  onPayment,
  onPrintReceipt,
  onNewTransaction,
}) => {
  const theme = useTheme();

  if (receiptReady) {
    return (
      <Stack spacing={2.5} sx={{ mt: 2 }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button
            variant="contained"
            color="success"
            fullWidth
            startIcon={<ReceiptIcon />}
            onClick={onPrintReceipt}
            sx={{
              py: 1.5,
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Rechnung drucken
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<ShoppingCartIcon />}
            onClick={onNewTransaction}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Neuer Verkauf
          </Button>
        </motion.div>
      </Stack>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onPayment}
          disabled={cartIsEmpty || cartLocked}
          sx={{
            py: 2,
            borderRadius: 2,
            boxShadow: 3,
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: 6,
              '&::before': {
                transform: 'translateX(100%)',
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.2)}, transparent)`,
              transition: 'transform 0.8s',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PaymentIcon sx={{ mr: 1.5, fontSize: 22 }} />
            <Typography variant="button" sx={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.5 }}>
              Zahlung abschließen
            </Typography>
          </Box>
        </Button>
      </motion.div>

      {cartIsEmpty && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
          }}
        >
          Fügen Sie Produkte zum Warenkorb hinzu, um fortzufahren
        </Typography>
      )}

      {cartLocked && (
        <Typography
          variant="caption"
          color="warning.main"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
            fontWeight: 500,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOpenIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem' }} />
            Warenkorb ist gesperrt. Starten Sie eine neue Transaktion.
          </Box>
        </Typography>
      )}
    </Box>
  );
};

CartActionButtons.propTypes = {
  receiptReady: PropTypes.bool.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
  cartLocked: PropTypes.bool,
  onPayment: PropTypes.func.isRequired,
  onPrintReceipt: PropTypes.func.isRequired,
  onNewTransaction: PropTypes.func.isRequired,
};

export default CartActionButtons;
