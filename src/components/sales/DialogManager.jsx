import React from 'react';
import { Slide } from '@mui/material';
import { PaymentDialog } from './index';
import { RedeemVoucherDialog } from '../vouchers';
import { RedeemDepositDialog } from '../deposit';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = 'Transition';

/**
 * Component to manage all dialogs used in the SalesScreen.
 * @param {object} props - The component props.
 * @param {boolean} props.paymentModalOpen - Controls the visibility of the payment dialog.
 * @param {function} props.onPaymentModalClose - Handler to close the payment dialog.
 * @param {function} props.onPaymentSubmit - Handler for submitting the payment.
 * @param {number} props.total - The total amount to be paid.
 * @param {Array<object>} props.cartItems - The items in the cart.
 * @param {number} props.voucherDiscount - The total discount amount from applied vouchers.
 * @param {number} props.depositCredit - The total credit amount from applied deposits.
 * @param {number} props.giftCardPayment - The amount paid via gift card.
 * @param {Array<object>} props.appliedVouchers - List of vouchers applied to the cart.
 * @param {string} props.paymentMethod - The selected payment method.
 * @param {number} props.cashReceived - The amount of cash received from the customer.
 * @param {object} props.cardDetails - Details related to card payment.
 * @param {function} props.onPaymentMethodChange - Handler for changing the payment method.
 * @param {function} props.onCashReceivedChange - Handler for changing the cash received amount.
 * @param {function} props.onCardDetailsChange - Handler for changing card details.
 * @param {number} props.change - The calculated change to be given back.
 * @param {boolean} props.paymentLoading - Indicates if the payment process is loading.
 * @param {boolean} props.redeemVoucherDialogOpen - Controls the visibility of the redeem voucher dialog.
 * @param {function} props.onRedeemVoucherDialogClose - Handler to close the redeem voucher dialog.
 * @param {function} props.onVoucherRedeemed - Handler called when a voucher is successfully redeemed.
 * @param {boolean} props.redeemDepositDialogOpen - Controls the visibility of the redeem deposit dialog.
 * @param {function} props.onRedeemDepositDialogClose - Handler to close the redeem deposit dialog.
 * @param {function} props.onDepositRedeemed - Handler called when a deposit is successfully redeemed.
 * @param {Array<string|number>} props.appliedDepositIds - List of IDs of deposits already applied.
 * @returns {React.ReactElement} The DialogManager component.
 */
const DialogManager = ({
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
  redeemVoucherDialogOpen,
  onRedeemVoucherDialogClose,
  onVoucherRedeemed,
  redeemDepositDialogOpen,
  onRedeemDepositDialogClose,
  onDepositRedeemed,
  appliedDepositIds,
}) => {
  return (
    <>
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

      <RedeemVoucherDialog
        open={redeemVoucherDialogOpen}
        onClose={onRedeemVoucherDialogClose}
        onVoucherRedeemed={onVoucherRedeemed}
        cartTotal={total}
      />

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
