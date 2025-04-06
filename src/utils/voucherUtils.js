/**
 * Utility functions for voucher management
 * This is a mock implementation that will be replaced with actual API calls
 */

// Mock storage for vouchers (will be replaced with API calls)
const MOCK_VOUCHERS = [
  {
    id: 'V001',
    code: 'WELCOME10',
    value: 10.0,
    remainingValue: 10.0,
    isRedeemed: false,
    issuedAt: '2023-05-15',
    expiresAt: '2023-12-31',
  },
  {
    id: 'V002',
    code: 'SUMMER20',
    value: 20.0,
    remainingValue: 0.0,
    isRedeemed: true,
    issuedAt: '2023-06-01',
    expiresAt: '2023-08-31',
    redeemedAt: '2023-07-15',
  },
  {
    id: 'V003',
    code: 'GIFT50',
    value: 50.0,
    remainingValue: 50.0,
    isRedeemed: false,
    issuedAt: '2023-07-10',
    expiresAt: '2024-07-10',
  },
];

/**
 * Generate a random voucher code
 * @returns {string} A random voucher code
 */
export const generateVoucherCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

/**
 * Validate a voucher code
 * @param {string} code - The voucher code to validate
 * @returns {Promise<Object>} The voucher object if valid
 */
export const validateVoucher = async code => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const voucher = MOCK_VOUCHERS.find(v => v.code === code && v.remainingValue > 0);
      if (voucher) {
        resolve(voucher);
      } else {
        reject(new Error('Ungültiger Gutscheincode oder Gutschein ohne Restguthaben'));
      }
    }, 500);
  });
};

/**
 * Redeem a voucher
 * @param {string} code - The voucher code to redeem
 * @param {number} amount - The amount to redeem (defaults to full remaining value)
 * @returns {Promise<Object>} The redeemed voucher
 */
export const redeemVoucher = async (code, amount = null) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const voucherIndex = MOCK_VOUCHERS.findIndex(v => v.code === code && v.remainingValue > 0);
      if (voucherIndex >= 0) {
        const voucher = { ...MOCK_VOUCHERS[voucherIndex] };

        // If amount is specified, only redeem that amount, otherwise redeem full remaining value
        const redeemAmount =
          amount !== null ? Math.min(amount, voucher.remainingValue) : voucher.remainingValue;

        // Update remaining value
        voucher.remainingValue = Math.max(0, voucher.remainingValue - redeemAmount);

        // Set isRedeemed to true only if fully redeemed
        if (voucher.remainingValue === 0) {
          voucher.isRedeemed = true;
          voucher.redeemedAt = new Date().toISOString().split('T')[0];
        }

        // Add redemption history if not present
        if (!voucher.redemptionHistory) {
          voucher.redemptionHistory = [];
        }

        // Add this redemption to history
        voucher.redemptionHistory.push({
          amount: redeemAmount,
          date: new Date().toISOString().split('T')[0],
        });

        // Update voucher in mock storage
        MOCK_VOUCHERS[voucherIndex] = voucher;

        // Return a copy with the amount that was actually redeemed
        resolve({
          ...voucher,
          redeemedAmount: redeemAmount,
        });
      } else {
        reject(new Error('Gutschein konnte nicht eingelöst werden'));
      }
    }, 800);
  });
};

/**
 * Issue a new voucher
 * @param {number} value - The value of the voucher
 * @param {string} expiresAt - The expiration date (YYYY-MM-DD)
 * @returns {Promise<Object>} The newly created voucher
 */
export const issueVoucher = async (value, expiresAt) => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      const newVoucher = {
        id: `V${String(MOCK_VOUCHERS.length + 1).padStart(3, '0')}`,
        code: generateVoucherCode(),
        value: parseFloat(value),
        remainingValue: parseFloat(value),
        isRedeemed: false,
        issuedAt: new Date().toISOString().split('T')[0],
        expiresAt:
          expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        redemptionHistory: [],
      };
      MOCK_VOUCHERS.push(newVoucher);
      resolve(newVoucher);
    }, 800);
  });
};

/**
 * Get all vouchers
 * @returns {Promise<Array>} List of all vouchers
 */
export const getAllVouchers = async () => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...MOCK_VOUCHERS]);
    }, 500);
  });
};
