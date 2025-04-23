import ReceiptIcon from '@mui/icons-material/Receipt';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../ui/buttons';

const DepositActionButtons = ({ onRedeemDeposit, cartIsEmpty, disabled = false }) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<ReceiptIcon />}
      onClick={onRedeemDeposit}
      size="small"
      fullWidth
      disabled={cartIsEmpty || disabled}
    >
      Pfandbeleg einlösen
    </Button>
  );
};

DepositActionButtons.propTypes = {
  onRedeemDeposit: PropTypes.func.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default DepositActionButtons;
