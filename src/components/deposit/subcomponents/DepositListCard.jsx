import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Badge,
  alpha,
  useTheme,
} from '@mui/material';
import BottleAltIcon from '@mui/icons-material/WineBarOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import DepositItemsList from '../DepositItemsList';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

/**
 * Displays the list of scanned deposit items, total value, and a button to generate a receipt.
 *
 * @param {object} props - The component props.
 * @param {object[]} props.scannedItems - Array of scanned item objects.
 * @param {boolean} props.isLoading - Indicates if an operation (like receipt generation) is in progress.
 * @param {boolean} props.itemAdded - Flag to trigger the 'item added' notification animation.
 * @param {number} props.totalBottles - The total count of scanned bottles.
 * @param {number} props.totalValue - The total monetary value of the scanned items.
 * @param {function} props.handleGenerateReceipt - Callback function triggered when the 'generate receipt' button is clicked.
 * @returns {JSX.Element} The DepositListCard component.
 */
const DepositListCard = ({
  scannedItems,
  isLoading,
  itemAdded,
  totalBottles,
  totalValue,
  handleGenerateReceipt,
}) => {
  const theme = useTheme();

  return (
    <motion.div variants={itemVariants}>
      <Card
        elevation={2}
        sx={{
          height: '100%',
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={itemAdded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            p: 1,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.success.main, 0.9),
            color: 'white',
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
            Pfandartikel hinzugefügt!
          </Typography>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge badgeContent={totalBottles} color="primary" showZero sx={{ mr: 2 }}>
                <BottleAltIcon color="primary" />
              </Badge>
              <Typography variant="h6" fontWeight="medium">
                Gescannte Flaschen
              </Typography>
            </Box>
            <Tooltip title="Bitte scannen Sie die Barcodes Ihrer Pfandflaschen ein">
              <IconButton
                size="small"
                component={motion.button}
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ p: 2, minHeight: '350px' }}>
            {isLoading && scannedItems.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ height: '300px' }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <AnimatePresence>
                <DepositItemsList
                  items={scannedItems}
                  onRemoveItem={null}
                  onUpdateQuantity={null}
                  readOnly={true}
                />
              </AnimatePresence>
            )}
          </Box>

          <Divider />

          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: theme.palette.grey[50],
            }}
          >
            <Box>
              <Typography variant="subtitle1" color="text.secondary">
                Gesamtwert:
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {totalValue.toFixed(2)} €
              </Typography>
            </Box>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ReceiptIcon />}
                onClick={handleGenerateReceipt}
                disabled={isLoading || scannedItems.length === 0}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[4],
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Bon erstellen'}
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DepositListCard;
