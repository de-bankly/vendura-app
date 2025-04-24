import React from 'react';
import { Grid, Card, CardContent, Avatar, Box, Typography, alpha, useTheme } from '@mui/material';
import BottleAltIcon from '@mui/icons-material/WineBarOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import BarcodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { motion } from 'framer-motion';

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

const pulseVariants = {
  pulse: {
    scale: [1, 1.02, 1],
    boxShadow: [
      '0px 4px 12px rgba(0,0,0,0.05)',
      '0px 8px 24px rgba(0,0,0,0.12)',
      '0px 4px 12px rgba(0,0,0,0.05)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

/**
 * Displays deposit statistics including total bottles, total value, and an action card.
 * Uses framer-motion for animations and Material UI for styling.
 *
 * @param {object} props - The component props.
 * @param {number} props.totalBottles - The total number of bottles deposited.
 * @param {number} props.totalValue - The total monetary value of the deposited bottles.
 * @returns {React.ReactElement} The rendered DepositStats component.
 */
const DepositStats = ({ totalBottles, totalValue }) => {
  const theme = useTheme();

  return (
    <motion.div variants={itemVariants}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card
            component={motion.div}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            sx={{
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[2],
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <BottleAltIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Flaschen gesamt
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {totalBottles}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            component={motion.div}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            sx={{
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[2],
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <LocalAtmIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pfandwert
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {totalValue.toFixed(2)} €
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            component={motion.div}
            variants={pulseVariants}
            animate="pulse"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            sx={{
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[2],
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.3)} 100%)`,
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                <BarcodeScannerIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Pfandflaschen scannen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Halte den Barcode vor den Scanner
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default DepositStats;
