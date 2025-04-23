/**
 * Handles the deposit redemption process
 */
export const handleDepositRedemption = ({
  depositReceipt,
  appliedDeposits,
  setAppliedDeposits,
  setDepositCredit,
  setRedeemDepositDialogOpen,
  showToast,
}) => {
  // Check if this deposit receipt has already been applied
  const isAlreadyApplied = appliedDeposits.some(deposit => deposit.id === depositReceipt.id);

  if (isAlreadyApplied) {
    // Close the dialog
    setRedeemDepositDialogOpen(false);

    // Show error message
    showToast({
      message: 'Dieser Pfandbeleg wurde bereits angewendet',
      severity: 'error',
    });
    return false;
  }

  // Add the deposit receipt to applied deposits
  setAppliedDeposits(prev => [...prev, depositReceipt]);

  // Update the deposit credit amount
  setDepositCredit(prev => prev + depositReceipt.value);

  // Close the dialog
  setRedeemDepositDialogOpen(false);

  // Show success message
  showToast({
    message: `Pfandbeleg im Wert von ${depositReceipt.value.toFixed(2)} € zum Warenkorb hinzugefügt`,
    severity: 'success',
  });

  return true;
};
