import React from 'react';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

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
 * Header component for the SalesScreen
 */
const SalesHeader = () => {
  const theme = useTheme();

  return (
    <motion.div variants={itemVariants}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        }}
      >
        <PointOfSaleIcon
          sx={{
            fontSize: 40,
            mr: 2,
            color: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            p: 1,
            borderRadius: theme.shape.borderRadius,
          }}
        />
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
          Verkaufsbildschirm
        </Typography>
      </Box>
    </motion.div>
  );
};

export default SalesHeader;
