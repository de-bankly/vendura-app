import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import {
  useTheme,
  alpha,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import QuickAccessCard from '../components/dashboard/QuickAccessCard';
import { InventoryManagementService, TransactionService } from '../services';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [inventoryStatus, setInventoryStatus] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    today: 0,
    yesterday: 0,
    trend: 0,
    positive: true,
    totalSales: 0,
    totalItems: 0,
    avgOrderValue: 0,
    topProducts: [],
  });
  const [recentSales, setRecentSales] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheStatus, setCacheStatus] = useState({
    fromCache: false,
    nextRefresh: null,
  });
  const [inventoryCacheStatus, setInventoryCacheStatus] = useState({
    fromCache: false,
    nextRefresh: null,
  });

  // Refresh-Intervall
  const refreshIntervalRef = useRef(null);
  const REFRESH_INTERVAL = 5 * 60000; // 5 Minuten

  // Fetch inventory status
  const fetchInventoryStatus = useCallback(
    async (forceRefresh = false) => {
      try {
        setIsLoading(true);

        // Hole Daten mit möglichem Cache
        const response = await InventoryManagementService.getInventoryStatus(forceRefresh);

        // Extrahiere die tatsächlichen Daten
        const data = response.data || response;
        const isFromCache = response.isFromCache === true;

        // Berechne den Zeitpunkt der nächsten automatischen Aktualisierung
        const nextRefresh = new Date(Date.now() + REFRESH_INTERVAL);

        // Aktualisiere den Inventory-Cache-Status
        setInventoryCacheStatus({
          fromCache: isFromCache,
          nextRefresh,
        });

        // Setze die extrahierten Inventardaten
        setInventoryStatus(data);

        // Aktualisiere den Zeitstempel für die letzte Aktualisierung
        // Nur wenn die Daten nicht aus dem Cache kamen, oder bei forciertem Refresh
        if (!isFromCache || forceRefresh) {
          setLastRefreshed(new Date());
        }
      } catch (error) {
        console.error('Error fetching inventory status:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [REFRESH_INTERVAL]
  );

  // Fetch latest sales data
  const fetchSalesData = useCallback(
    async (forceRefresh = false) => {
      try {
        setIsRefreshing(true);

        // Hole den Start-Zeitstempel, um zu erkennen, ob Daten aus dem Cache kommen
        const startTime = performance.now();

        const response = await TransactionService.getLatestSales(
          { page: 0, size: 10 },
          forceRefresh
        );

        // Wir bekommen das isFromCache-Flag direkt aus dem response
        const data = response.data || response;
        const isFromCache = response.isFromCache === true;

        // Berechne den Zeitpunkt der nächsten automatischen Aktualisierung
        const nextRefresh = new Date(Date.now() + REFRESH_INTERVAL);

        // Aktualisiere den Cache-Status
        setCacheStatus({
          fromCache: isFromCache,
          nextRefresh,
        });

        // Set recent sales (nur die ersten 5 anzeigen)
        setRecentSales(data.content?.slice(0, 5) || []);

        // Calculate sales data (today and yesterday)
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Calculate total sales for today and yesterday
        let todaySales = 0;
        let yesterdaySales = 0;
        let totalSales = 0;
        let totalItems = 0;

        // Artikel-Tracking für Top-Produkte
        const productCounts = {};

        if (data.content && data.content.length > 0) {
          data.content.forEach(sale => {
            const saleDate = new Date(sale.date).toISOString().split('T')[0];
            const saleTotal = sale.total || 0;

            totalSales += saleTotal;

            // Zähle alle verkauften Artikel
            if (sale.positions && sale.positions.length > 0) {
              sale.positions.forEach(position => {
                const quantity = position.quantity || 0;
                totalItems += quantity;

                // Tracke Produkte für Top-Produkte Liste
                const productId = position.productDTO?.id;
                const productName = position.productDTO?.name || 'Unbekanntes Produkt';

                if (productId) {
                  if (!productCounts[productId]) {
                    productCounts[productId] = {
                      id: productId,
                      name: productName,
                      count: 0,
                      total: 0,
                    };
                  }

                  productCounts[productId].count += quantity;
                  productCounts[productId].total +=
                    position.quantity * (position.productDTO?.price || 0);
                }
              });
            }

            if (saleDate === today) {
              todaySales += saleTotal;
            } else if (saleDate === yesterdayStr) {
              yesterdaySales += saleTotal;
            }
          });
        }

        // Calculate trend percentage
        let trend = 0;
        let positive = true;

        if (yesterdaySales > 0) {
          trend = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
          positive = trend >= 0;
          trend = Math.abs(trend).toFixed(2);
        }

        // Berechne Durchschnittlichen Bestellwert
        const avgOrderValue =
          data.content && data.content.length > 0 ? totalSales / data.content.length : 0;

        // Erstelle Top-Produkte Liste
        const topProducts = Object.values(productCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        setSalesData({
          today: todaySales,
          yesterday: yesterdaySales,
          trend,
          positive,
          totalSales,
          totalItems,
          avgOrderValue,
          topProducts,
        });

        // Aktualisiere den Zeitstempel für die letzte Aktualisierung
        // Nur wenn die Daten nicht aus dem Cache kamen, oder bei forciertem Refresh
        if (!isFromCache || forceRefresh) {
          setLastRefreshed(new Date());
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setIsRefreshing(false);
        setIsLoadingSales(false);
      }
    },
    [REFRESH_INTERVAL]
  );

  // Initialisiere die Daten beim ersten Laden der Komponente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Prüfe, ob wir schon aktuelle Daten im localStorage haben
        const cachedSalesData = await TransactionService.getLatestSales(
          { page: 0, size: 10 },
          false
        );
        const cachedInventoryData = await InventoryManagementService.getInventoryStatus(false);

        // Wenn wir Daten aus dem Cache bekommen haben, können wir diese verwenden
        if (cachedSalesData.isFromCache) {
          // Löse die existierenden Daten mit fetchSalesData aus, aber ohne forceRefresh
          fetchSalesData(false);
        } else {
          // Wenn keine Daten im Cache, erzwinge ein Refresh
          fetchSalesData(true);
        }

        // Wenn wir Inventardaten aus dem Cache bekommen haben, können wir diese verwenden
        if (cachedInventoryData.isFromCache) {
          // Verwende existierende Daten ohne forceRefresh
          fetchInventoryStatus(false);
        } else {
          // Wenn keine Daten im Cache, erzwinge ein Refresh
          fetchInventoryStatus(true);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Bei Fehler: Erzwinge Refresh für beide Datenquellen
        fetchInventoryStatus(true);
        fetchSalesData(true);
      }
    };

    // Lade die initialen Daten
    loadInitialData();

    // Starte das Refresh-Intervall
    refreshIntervalRef.current = setInterval(() => {
      fetchSalesData();
      fetchInventoryStatus();
    }, REFRESH_INTERVAL);

    // Cleanup beim Unmount der Komponente
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchInventoryStatus, fetchSalesData, REFRESH_INTERVAL]);

  // Manuelles Refresh der Daten
  const handleRefresh = () => {
    fetchSalesData(true); // Force refresh aus dem Cache
    fetchInventoryStatus(true);
  };

  // Formatiere den letzten Aktualisierungszeitpunkt
  const getRefreshTimeDisplay = () => {
    const now = new Date();
    const diffMs = now - lastRefreshed;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) {
      return `vor ${diffSec} Sekunden`;
    } else if (diffSec < 3600) {
      const diffMin = Math.floor(diffSec / 60);
      return `vor ${diffMin} Minuten`;
    } else {
      return lastRefreshed.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // Formatiere den Zeitpunkt der nächsten Aktualisierung
  const getNextRefreshDisplay = () => {
    if (!cacheStatus.nextRefresh) return '';

    return cacheStatus.nextRefresh.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Data for Quick Access Cards
  const quickAccessItems = [
    {
      title: 'Verkauf',
      description: 'Kasse öffnen und Verkäufe tätigen',
      icon: <PointOfSaleIcon />,
      path: '/sales',
      color: 'primary',
    },
    {
      title: 'Inventar',
      description: 'Produkte verwalten und bearbeiten',
      icon: <InventoryIcon />,
      path: '/inventory',
      color: 'secondary',
    },
    {
      title: 'Gutscheine',
      description: 'Gutscheine erstellen und einlösen',
      icon: <CardGiftcardIcon />,
      path: '/admin/giftcards',
      color: 'success',
    },
    {
      title: 'Angebote',
      description: 'Rabatte und Angebote verwalten',
      icon: <LocalOfferIcon />,
      path: '/admin/promotions',
      color: 'warning',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Header mit Last Refreshed und Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Willkommen
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hier finden Sie eine Übersicht über die wichtigsten Kennzahlen.
            </Typography>
          </Box>
        </motion.div>

        {/* Refresh Button und Last Refreshed Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="caption" color="text.secondary">
              Aktualisiert: {getRefreshTimeDisplay()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.7, fontSize: '0.65rem' }}
            >
              Nächste Auto-Aktualisierung: {getNextRefreshDisplay()}
            </Typography>
          </Box>

          <Tooltip title={cacheStatus.fromCache ? 'Daten aus dem Cache' : 'Daten vom Server'}>
            <Badge
              color={cacheStatus.fromCache ? 'success' : 'primary'}
              variant="dot"
              sx={{ mr: 1 }}
            >
              <StorageIcon fontSize="small" color="action" />
            </Badge>
          </Tooltip>

          <Tooltip title="Daten aktualisieren">
            <IconButton
              onClick={handleRefresh}
              size="small"
              color="primary"
              disabled={isRefreshing}
            >
              {isRefreshing ? <CircularProgress size={20} /> : <RefreshIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Dashboard Area */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3}>
          {/* Left Column - Combined Revenue and Inventory Card */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Combined Card */}
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Umsatz Heute
                  </Typography>
                  {!isLoadingSales && (
                    <Chip
                      size="small"
                      icon={
                        salesData.positive ? (
                          <TrendingUpIcon fontSize="small" />
                        ) : (
                          <TrendingDownIcon fontSize="small" />
                        )
                      }
                      label={`${salesData.trend}%`}
                      color={salesData.positive ? 'success' : 'error'}
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Box>

                {isLoadingSales ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {salesData.today.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Gestern:{' '}
                      {salesData.yesterday.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Zusätzliche Verkaufsstatistiken */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Verkaufsstatistiken
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" component="div">
                            Gesamtumsatz
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {salesData.totalSales.toLocaleString('de-DE', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" component="div">
                            Verkaufte Artikel
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {salesData.totalItems}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" component="div">
                            Ø Bestellwert
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {salesData.avgOrderValue.toLocaleString('de-DE', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" component="div">
                            Anzahl Verkäufe
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {recentSales.length}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Top Produkte */}
                    {salesData.topProducts && salesData.topProducts.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Top Produkte
                        </Typography>

                        {salesData.topProducts.map((product, index) => (
                          <Box
                            key={product.id}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                maxWidth: '70%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {product.name}
                            </Typography>
                            <Typography variant="caption" fontWeight={500}>
                              {product.count}× /{' '}
                              {product.total.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                              })}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <InventoryIcon
                          sx={{ fontSize: '1rem', mr: 1, color: theme.palette.primary.main }}
                        />
                        Inventarstatus
                        <Tooltip
                          title={
                            inventoryCacheStatus.fromCache
                              ? 'Daten aus dem Cache'
                              : 'Daten vom Server'
                          }
                        >
                          <Badge
                            color={inventoryCacheStatus.fromCache ? 'success' : 'primary'}
                            variant="dot"
                            sx={{ ml: 1 }}
                          >
                            <StorageIcon
                              fontSize="small"
                              color="action"
                              sx={{ fontSize: '0.8rem' }}
                            />
                          </Badge>
                        </Tooltip>
                      </Typography>

                      {inventoryCacheStatus.nextRefresh && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mb: 1,
                            fontSize: '0.65rem',
                            opacity: 0.7,
                            textAlign: 'right',
                          }}
                        >
                          Nächste Aktualisierung:{' '}
                          {inventoryCacheStatus.nextRefresh.toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      )}

                      {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                          <CircularProgress
                            size={30}
                            sx={{ color: theme.palette.secondary.main }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ mt: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1.5,
                              p: 1,
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              borderRadius: theme.shape.borderRadius,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <StorageIcon
                                sx={{
                                  fontSize: '0.875rem',
                                  mr: 0.75,
                                  color: theme.palette.primary.main,
                                }}
                              />
                              Gesamtanzahl Produkte
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {inventoryStatus.total}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1.5,
                              p: 1,
                              bgcolor: alpha(theme.palette.warning.main, 0.05),
                              borderRadius: theme.shape.borderRadius,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <TimelineIcon
                                sx={{
                                  fontSize: '0.875rem',
                                  mr: 0.75,
                                  color: theme.palette.warning.main,
                                }}
                              />
                              Geringer Bestand
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="warning.main">
                              {inventoryStatus.lowStock}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 1,
                              bgcolor: alpha(theme.palette.error.main, 0.05),
                              borderRadius: theme.shape.borderRadius,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <BarChartIcon
                                sx={{
                                  fontSize: '0.875rem',
                                  mr: 0.75,
                                  color: theme.palette.error.main,
                                }}
                              />
                              Nicht vorrätig
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="error.main">
                              {inventoryStatus.outOfStock}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </>
                )}

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/sales/history')}
                    startIcon={<ReceiptLongIcon />}
                  >
                    Umsatz Details
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/sales')}
                    startIcon={<ShoppingCartIcon />}
                  >
                    Verkaufen
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Quick Access Cards and Recent Transactions */}
          <Grid item xs={12} md={8}>
            {/* Quick Access Cards - Grid Layout */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={3}>
                {quickAccessItems.map((item, index) => (
                  <Grid item xs={6} sm={6} md={3} key={index}>
                    <QuickAccessCard
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      path={item.path}
                      color={item.color}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Recent Transactions Card */}
            <Card>
              <CardContent sx={{ p: 3, bgcolor: alpha(theme.palette.primary.light, 0.03) }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ReceiptLongIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Letzte Transaktionen
                    </Typography>
                  </Box>
                  {isRefreshing && <CircularProgress size={20} />}
                </Box>

                {isLoadingSales ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress size={40} sx={{ color: theme.palette.secondary.main }} />
                  </Box>
                ) : recentSales.length > 0 ? (
                  recentSales.map((sale, index) => (
                    <React.Fragment key={sale.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          py: 1.5,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.light, 0.05),
                            borderRadius: theme.shape.borderRadius,
                          },
                          px: 1.5,
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              mr: 2,
                              mt: 0.5,
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                            }}
                          >
                            <ReceiptLongIcon fontSize="small" />
                          </Avatar>
                          <Box sx={{ width: '100%' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Verkauf #{sale.id.slice(0, 8)}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: theme.palette.secondary.main,
                                }}
                              >
                                {(sale.total || 0).toLocaleString('de-DE', {
                                  style: 'currency',
                                  currency: 'EUR',
                                })}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mb: 1, display: 'block' }}
                            >
                              {new Date(sale.date).toLocaleDateString('de-DE')}{' '}
                              {new Date(sale.date).toLocaleTimeString('de-DE', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>

                            {/* Zeige Positionen des Verkaufs an */}
                            {sale.positions && sale.positions.length > 0 && (
                              <Box
                                sx={{
                                  mt: 1,
                                  pl: 1,
                                  borderLeft: `2px solid ${alpha(
                                    theme.palette.secondary.main,
                                    0.3
                                  )}`,
                                }}
                              >
                                {sale.positions.slice(0, 2).map((position, pIndex) => (
                                  <Box
                                    key={pIndex}
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      mb: 0.5,
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                      {position.quantity}× {position.productDTO?.name || 'Produkt'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                      {(
                                        position.quantity * (position.productDTO?.price || 0) -
                                        (position.discountEuro || 0)
                                      ).toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                      })}
                                    </Typography>
                                  </Box>
                                ))}
                                {sale.positions.length > 2 && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mt: 0.5, display: 'block' }}
                                  >
                                    + {sale.positions.length - 2} weitere Positionen
                                  </Typography>
                                )}
                              </Box>
                            )}

                            {/* Zahlungsinformationen */}
                            {sale.payments && sale.payments.length > 0 && (
                              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {sale.payments.map((payment, paymentIndex) => (
                                  <Chip
                                    key={paymentIndex}
                                    size="small"
                                    label={`${
                                      payment.type === 'CASH'
                                        ? 'Bar'
                                        : payment.type === 'CARD'
                                          ? 'Karte'
                                          : 'Gutschein'
                                    }: ${payment.amount.toLocaleString('de-DE', {
                                      style: 'currency',
                                      currency: 'EUR',
                                    })}`}
                                    color={
                                      payment.type === 'CASH'
                                        ? 'success'
                                        : payment.type === 'CARD'
                                          ? 'info'
                                          : 'secondary'
                                    }
                                    variant="outlined"
                                    sx={{
                                      height: 20,
                                      fontSize: '0.65rem',
                                      borderWidth: '1px',
                                      '& .MuiChip-label': {
                                        fontWeight: 500,
                                      },
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      {index < recentSales.length - 1 && <Divider sx={{ my: 0.5 }} />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Keine Transaktionen gefunden
                  </Typography>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/sales/transactions')}
                    color="primary"
                    endIcon={<ReceiptLongIcon />}
                    sx={{
                      px: 3,
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    Alle Transaktionen
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Home;
