import { Box, Typography, Button } from '@mui/material';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';
import { fadeVariants } from '../../utils/animations';

/**
 * Renders a placeholder component indicating an empty cart state.
 * Includes an icon, messages, and an optional action button.
 * Uses framer-motion for animations.
 *
 * @component
 * @param {object} props - Component props.
 * @param {string} [props.message='Der Warenkorb ist leer'] - The main message to display.
 * @param {string} [props.subMessage='Fügen Sie Produkte hinzu, um mit dem Einkauf zu beginnen'] - The secondary message or instruction.
 * @param {string} [props.actionText='Produkte durchsuchen'] - The text for the action button.
 * @param {Function|null} [props.onAction=null] - Callback function for the action button. Button is hidden if null.
 * @returns {React.ReactElement} The rendered EmptyCart component.
 */
const EmptyCart = ({
  message = 'Der Warenkorb ist leer',
  subMessage = 'Fügen Sie Produkte hinzu, um mit dem Einkauf zu beginnen',
  actionText = 'Produkte durchsuchen',
  onAction = null,
}) => {
  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeVariants}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          py: 6,
          px: 3,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: 0.1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: theme =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(25, 118, 210, 0.08)',
              mb: 3,
            }}
          >
            <LocalMallIcon
              sx={{
                fontSize: 40,
                color: 'primary.main',
              }}
            />
          </Box>
        </motion.div>

        <Typography
          variant="h6"
          component={motion.h2}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          sx={{
            fontWeight: 600,
            mb: 1,
            color: 'text.primary',
          }}
        >
          {message}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          component={motion.p}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          sx={{
            mb: 4,
            maxWidth: 280,
          }}
        >
          {subMessage}
        </Typography>

        {onAction && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddShoppingCartIcon />}
              onClick={onAction}
              size="medium"
              sx={{
                borderRadius: '50px',
                px: 3,
              }}
            >
              {actionText}
            </Button>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

EmptyCart.propTypes = {
  /**
   * The main message to display.
   */
  message: PropTypes.string,
  /**
   * The secondary message or instruction.
   */
  subMessage: PropTypes.string,
  /**
   * The text for the action button.
   */
  actionText: PropTypes.string,
  /**
   * Callback function for the action button. Button is hidden if null.
   */
  onAction: PropTypes.func,
};

export default EmptyCart;
