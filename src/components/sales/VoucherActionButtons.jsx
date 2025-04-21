import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../ui/buttons';

const VoucherActionButtons = ({ onPurchaseVoucher, onRedeemVoucher, cartIsEmpty }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CardGiftcardIcon />}
          onClick={onPurchaseVoucher}
          size="small"
          fullWidth
        >
          Gutschein kaufen
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CardGiftcardIcon />}
          onClick={onRedeemVoucher}
          size="small"
          fullWidth
          disabled={cartIsEmpty}
        >
          Einlösen
        </Button>
      </Grid>
    </Grid>
  );
};

VoucherActionButtons.propTypes = {
  onPurchaseVoucher: PropTypes.func.isRequired,
  onRedeemVoucher: PropTypes.func.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
};

export default VoucherActionButtons;
