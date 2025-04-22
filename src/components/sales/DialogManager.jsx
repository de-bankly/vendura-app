import React from 'react';
import { Slide, Snackbar, Alert } from '@mui/material';
import { PaymentDialog } from './index';
import { RedeemVoucherDialog, VoucherManagementDialog } from '../vouchers';
import { RedeemDepositDialog } from '../deposit';

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = 'Transition';

/**
 * Component to manage all dialogs used in the SalesScreen
 */
const DialogManager = ({
  // Payment dialog props
  paymentModalOpen,
  onPaymentModalClose,
  onPaymentSubmit,
  total,
  cartItems,
  voucherDiscount,
  depositCredit,
  giftCardPayment,
  appliedVouchers,
  paymentMethod,
  cashReceived,
  cardDetails,
  onPaymentMethodChange,
  onCashReceivedChange,
  onCardDetailsChange,
  change,
  paymentLoading,

  // Voucher dialog props
  redeemVoucherDialogOpen,
  onRedeemVoucherDialogClose,
  onVoucherRedeemed,

  // Voucher management dialog props
  voucherManagementDialogOpen,
  onVoucherManagementDialogClose,

  // Deposit dialog props
  redeemDepositDialogOpen,
  onRedeemDepositDialogClose,
  onDepositRedeemed,
  appliedDepositIds,

  // Snackbar props
  successSnackbarOpen,
  onSnackbarClose,
}) => {
  return (
    <>
      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentModalOpen}
        onClose={onPaymentModalClose}
        onComplete={onPaymentSubmit}
        total={total}
        cartItemsCount={cartItems.length}
        voucherDiscount={voucherDiscount}
        depositCredit={depositCredit}
        giftCardPayment={giftCardPayment}
        appliedVouchers={appliedVouchers}
        paymentMethod={paymentMethod}
        cashReceived={cashReceived}
        cardDetails={cardDetails}
        onPaymentMethodChange={onPaymentMethodChange}
        onCashReceivedChange={onCashReceivedChange}
        onCardDetailsChange={onCardDetailsChange}
        change={change}
        TransitionComponent={Transition}
        loading={paymentLoading}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={onSnackbarClose}
          severity="success"
          variant="filled"
          elevation={6}
          sx={{ width: '100%' }}
        >
          Zahlung erfolgreich abgeschlossen!
        </Alert>
      </Snackbar>

      {/* Redeem Voucher Dialog */}
      <RedeemVoucherDialog
        open={redeemVoucherDialogOpen}
        onClose={onRedeemVoucherDialogClose}
        onVoucherRedeemed={onVoucherRedeemed}
        cartTotal={total}
      />

      {/* Redeem Deposit Receipt Dialog */}
      <RedeemDepositDialog
        open={redeemDepositDialogOpen}
        onClose={onRedeemDepositDialogClose}
        onDepositRedeemed={onDepositRedeemed}
        appliedDepositIds={appliedDepositIds}
      />

      {/* Voucher Management Dialog */}
      <VoucherManagementDialog
        open={voucherManagementDialogOpen}
        onClose={onVoucherManagementDialogClose}
      />
    </>
  );
};

export default DialogManager;
