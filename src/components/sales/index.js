// Import all components
import ProductGrid from './ProductGrid';
import ShoppingCart from './ShoppingCart';
import ProductCard from './ProductCard';
import PaymentDialog from './PaymentDialog';
import SearchBar from './SearchBar';
import DepositActionButtons from './DepositActionButtons';
import CartSummary from './CartSummary';
import CategoryFilter from './CategoryFilter';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import AppliedVoucher from './AppliedVoucher';
import VoucherActionButtons from './VoucherActionButtons';
import VoucherInputField from './VoucherInputField';
import GiftCardPaymentSection from './GiftCardPaymentSection';
import AppliedVouchersDisplay from './AppliedVouchersDisplay';
import CartActionButtons from './CartActionButtons';

// Import new components
import SalesHeader from './SalesHeader';
import CartHeader from './CartHeader';
import SalesMainContent from './SalesMainContent';
import DialogManager from './DialogManager';

// Import utility functions
import { calculateVoucherDiscount, calculateGiftCardPayment } from './VoucherCalculator';
import * as CartStateManager from './CartStateManager';
import { processPayment } from './PaymentProcessor';
import { handleDepositRedemption } from './DepositHandler';

// Export all components
export {
  ProductGrid,
  ShoppingCart,
  ProductCard,
  PaymentDialog,
  SearchBar,
  DepositActionButtons,
  CartSummary,
  CategoryFilter,
  CartItem,
  EmptyCart,
  AppliedVoucher,
  VoucherActionButtons,
  VoucherInputField,
  GiftCardPaymentSection,
  AppliedVouchersDisplay,
  CartActionButtons,
  SalesHeader,
  CartHeader,
  SalesMainContent,
  DialogManager,
  // Export utility functions
  calculateVoucherDiscount,
  calculateGiftCardPayment,
  CartStateManager,
  processPayment,
  handleDepositRedemption,
};
