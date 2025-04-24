import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Fade,
  alpha,
  useTheme,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion } from 'framer-motion';
import DepositReceipt from '../DepositReceipt';

/**
 * Displays a dialog showing the details of a generated deposit receipt.
 * Includes animations and styling using MUI and Framer Motion.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {function} props.onClose - Callback function invoked when the dialog requests to be closed.
 * @param {object} props.receiptData - The data object for the deposit receipt to be displayed.
 * @returns {React.ReactElement} The rendered DepositReceiptDialog component.
 */
const DepositReceiptDialog = ({ open, onClose, receiptData }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { type: 'spring', duration: 0.5 },
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: alpha('#ffffff', 0.2),
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            <ReceiptIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Pfandbon erstellt
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {receiptData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <DepositReceipt receipt={receiptData} />
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: alpha(theme.palette.info.light, 0.1),
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <InfoOutlinedIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Der Pfandbon wurde automatisch gedruckt. Bitte lösen Sie ihn an der Kasse ein.
              </Typography>
            </Box>
          </motion.div>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} variant="outlined">
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepositReceiptDialog;
