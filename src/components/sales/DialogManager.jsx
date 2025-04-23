import React from 'react';
import { Slide } from '@mui/material';
import { PaymentDialog } from './index';
import { RedeemVoucherDialog } from '../vouchers';
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

  // Deposit dialog props
  redeemDepositDialogOpen,
  onRedeemDepositDialogClose,
  onDepositRedeemed,
  appliedDepositIds,
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
    </>
  );
};

export default DialogManager;
