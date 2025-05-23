import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '../components/auth';
import { withFaroRouterInstrumentation, setRouter } from '../utils/faro';
import { BarcodeProvider } from '../contexts/BarcodeContext';

const TopNavLayout = lazy(() => import('../components/layout/TopNavLayout'));

const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));
const SalesScreen = lazy(() => import('../pages/SalesScreen'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'));
const RoleManagementPage = lazy(() => import('../pages/admin/RoleManagementPage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage'));
const InventoryManagementPage = lazy(() => import('../pages/InventoryManagementPage'));
const ProductManagementPage = lazy(() => import('../pages/admin/ProductManagementPage'));
const GiftCardManagementPage = lazy(() => import('../pages/admin/GiftCardManagementPage'));
const PromotionManagementScreen = lazy(() => import('../pages/PromotionManagementScreen'));
const PfandautomatPage = lazy(() => import('../pages/PfandautomatPage'));

const RouterErrorBoundary = lazy(() =>
  import('../components/error/ErrorBoundary').then(module => ({
    default: module.RouterErrorBoundary,
  }))
);

/**
 * Application router configuration
 * Defines all available routes and their corresponding components
 * @type {import('react-router-dom').Router}
 */
const reactBrowserRouter = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <TopNavLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'sales',
        element: (
          <BarcodeProvider>
            <SalesScreen />
          </BarcodeProvider>
        ),
      },
      {
        path: 'inventory',
        element: (
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inventory-management',
        element: (
          <ProtectedRoute>
            <InventoryManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'promotions',
        element: (
          <ProtectedRoute>
            <PromotionManagementScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: 'deposit',
        element: (
          <ProtectedRoute>
            <BarcodeProvider>
              <PfandautomatPage />
            </BarcodeProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        children: [
          {
            path: 'users',
            element: (
              <ProtectedRoute adminOnly>
                <UserManagementPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'roles',
            element: (
              <ProtectedRoute adminOnly>
                <RoleManagementPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'products',
            element: (
              <ProtectedRoute adminOnly>
                <ProductManagementPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'giftcards',
            element: (
              <ProtectedRoute adminOnly>
                <GiftCardManagementPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'promotions',
            element: (
              <ProtectedRoute adminOnly>
                <PromotionManagementScreen />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
      },
      {
        path: 'error-page',
        element: <ErrorPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

setRouter(reactBrowserRouter);

const router = withFaroRouterInstrumentation(reactBrowserRouter);

export default router;
