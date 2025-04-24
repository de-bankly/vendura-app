/**
 * Handles the deposit redemption process.
 *
 * @param {object} options - The options object.
 * @param {{id: string, total: number}} options.depositReceipt - The deposit receipt object to redeem.
 * @param {Array<{id: string}>} options.appliedDeposits - Array of already applied deposit receipts.
 * @param {Function} options.setAppliedDeposits - Function to update the list of applied deposits.
 * @param {Function} options.setDepositCredit - Function to update the total deposit credit.
 * @param {Function} options.setRedeemDepositDialogOpen - Function to control the redeem deposit dialog visibility.
 * @param {Function} options.showToast - Function to display toast notifications.
 * @returns {boolean} - True if the deposit was successfully redeemed, false otherwise.
 */
export const handleDepositRedemption = ({
  depositReceipt,
  appliedDeposits,
  setAppliedDeposits,
  setDepositCredit,
  setRedeemDepositDialogOpen,
  showToast,
}) => {
  const isAlreadyApplied = appliedDeposits.some(deposit => deposit.id === depositReceipt.id);

  if (isAlreadyApplied) {
    setRedeemDepositDialogOpen(false);
    showToast({
      message: 'Dieser Pfandbeleg wurde bereits angewendet',
      severity: 'error',
    });
    return false;
  }

  setAppliedDeposits(prev => [...prev, depositReceipt]);
  setDepositCredit(prev => prev + depositReceipt.total);
  setRedeemDepositDialogOpen(false);
  showToast({
    message: `Pfandbeleg im Wert von ${
      depositReceipt.total?.toFixed(2) ?? 'unbekannt'
    } € zum Warenkorb hinzugefügt`,
    severity: 'success',
  });

  return true;
};
