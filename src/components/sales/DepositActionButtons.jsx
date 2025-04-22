import ReceiptIcon from '@mui/icons-material/Receipt';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../ui/buttons';

const DepositActionButtons = ({ onRedeemDeposit, cartIsEmpty }) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<ReceiptIcon />}
      onClick={onRedeemDeposit}
      size="small"
      fullWidth
      disabled={cartIsEmpty}
    >
      Pfandbeleg einlösen
    </Button>
  );
};

DepositActionButtons.propTypes = {
  onRedeemDeposit: PropTypes.func.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
};

export default DepositActionButtons;
