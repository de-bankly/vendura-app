import { Box, Typography } from '@mui/material';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';
import { fadeVariants } from '../../utils/animations';

const EmptyCart = ({ message = 'Der Warenkorb ist leer' }) => {
  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeVariants}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          opacity: 0.7,
        }}
      >
        <LocalMallIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </motion.div>
  );
};

EmptyCart.propTypes = {
  message: PropTypes.string,
};

export default EmptyCart;
