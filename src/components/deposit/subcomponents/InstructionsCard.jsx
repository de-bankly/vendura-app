import React from 'react';
import { Card, CardContent, Box, Typography, Stack, Avatar, alpha, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

/**
 * Animation variants for Framer Motion used within the InstructionsCard.
 * Defines 'hidden' and 'visible' states for item animations.
 */
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
 * Renders a card component displaying step-by-step instructions
 * for using the bottle scanning feature. Includes visual steps
 * and subtle animations.
 *
 * @returns {JSX.Element} The InstructionsCard component.
 */
const InstructionsCard = () => {
  const theme = useTheme();

  return (
    <motion.div variants={itemVariants}>
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" fontWeight="medium">
            Anleitung
          </Typography>
        </Box>

        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  mr: 1.5,
                }}
              >
                1
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  Flasche scannen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Halten Sie den Barcode vor den Scanner
                </Typography>
              </Box>
            </Box>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <ArrowForwardIcon color="primary" />
              </Box>
            </motion.div>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  mr: 1.5,
                }}
              >
                2
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  Pfandwert wird berechnet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Der Wert wird automatisch addiert
                </Typography>
              </Box>
            </Box>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <ArrowForwardIcon color="primary" />
              </Box>
            </motion.div>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  mr: 1.5,
                }}
              >
                3
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  Pfandbon erstellen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lösen Sie den Bon an der Kasse ein
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InstructionsCard;
