import React from 'react';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Grid, Typography, Box, Card, CardContent, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Chip } from '../ui/feedback';

// Animation variants
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

/**
 * Component that displays summary cards for sales information
 */
const SalesSummaryCards = ({
  cartItems,
  total,
  products,
  productsByCategory,
  appliedVouchers,
  voucherDiscount,
}) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Cart Summary Card */}
      <Grid item xs={12} sm={6} md={4}>
        <motion.div variants={itemVariants}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Warenkorb</Typography>
                <Chip
                  size="small"
                  icon={<ShoppingCartIcon fontSize="small" />}
                  label={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  color="primary"
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}>
                {(parseFloat(total) || 0).toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cartItems.length} Artikel
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>

      {/* Product Summary Card */}
      <Grid item xs={12} sm={6} md={4}>
        <motion.div variants={itemVariants}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Produkte</Typography>
                <Chip
                  size="small"
                  icon={<InventoryIcon fontSize="small" />}
                  label={products.length}
                  color="success"
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {Object.keys(productsByCategory).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kategorien
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>

      {/* Voucher Summary Card */}
      <Grid item xs={12} sm={6} md={4}>
        <motion.div variants={itemVariants}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Gutscheine</Typography>
                <Chip
                  size="small"
                  icon={<CardGiftcardIcon fontSize="small" />}
                  label={appliedVouchers.length}
                  color="info"
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}>
                {voucherDiscount.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rabatt angewendet
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    </Grid>
  );
};

export default SalesSummaryCards;
