import ReceiptIcon from '@mui/icons-material/Receipt';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../ui/buttons';

const DepositActionButtons = ({ onRedeemDeposit, cartIsEmpty }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
};

DepositActionButtons.propTypes = {
  onRedeemDeposit: PropTypes.func.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
};

export default DepositActionButtons;
