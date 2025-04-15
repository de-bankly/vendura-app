import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import QuickAccessCard from '../components/dashboard/QuickAccessCard';
import { InventoryManagementService } from '../services';

// Icons

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [inventoryStatus, setInventoryStatus] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch inventory status on component mount
  useEffect(() => {
    const fetchInventoryStatus = async () => {
      try {
        setIsLoading(true);
        const data = await InventoryManagementService.getInventoryStatus();
        setInventoryStatus(data);
      } catch (error) {
        console.error('Error fetching inventory status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryStatus();
  }, []);

  // Mock data for the dashboard
  const salesData = {
    today: 1250.75,
    yesterday: 980.5,
    trend: 27.56,
    positive: true,
  };

  const recentTransactions = [
    { id: 'TX-1234', customer: 'Max Mustermann', amount: 78.5, time: '10:23', status: 'completed' },
    {
      id: 'TX-1235',
      customer: 'Laura Schmidt',
      amount: 125.99,
      time: '09:45',
      status: 'completed',
    },
    { id: 'TX-1236', customer: 'Thomas Weber', amount: 49.99, time: '09:12', status: 'pending' },
    { id: 'TX-1237', customer: 'Anna Müller', amount: 199.5, time: '08:30', status: 'completed' },
  ];

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
      path: '/giftcards',
      color: 'success',
    },
    {
      title: 'Angebote',
      description: 'Rabatte und Angebote verwalten',
      icon: <LocalOfferIcon />,
      path: '/vouchers',
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
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Willkommen
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hier finden Sie eine Übersicht über die wichtigsten Kennzahlen.
          </Typography>
        </Box>
      </motion.div>

      {/* Quick Access Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Quick Access Cards - First Row - USE LOOP */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {quickAccessItems.map((item, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
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
          </Grid>

          {/* Sales Overview Card */}
          <Grid item xs={12} md={4}>
            <motion.div>
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
                  </Box>

                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {salesData.today.toLocaleString('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Gestern:{' '}
                    {salesData.yesterday.toLocaleString('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </Typography>

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
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Recent Transactions & Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Grid container spacing={3}>
          {/* Recent Transactions */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Letzte Transaktionen
                </Typography>

                {recentTransactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            mr: 2,
                            bgcolor:
                              transaction.status === 'completed'
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.warning.main, 0.1),
                            color:
                              transaction.status === 'completed' ? 'success.main' : 'warning.main',
                          }}
                        >
                          {transaction.customer.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {transaction.customer}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transaction.id} | {transaction.time}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {transaction.amount.toLocaleString('de-DE', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </Typography>
                    </Box>
                    {index < recentTransactions.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </React.Fragment>
                ))}

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button variant="outlined" onClick={() => navigate('/sales/transactions')}>
                    Alle Transaktionen
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Inventory Status */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Inventarstatus
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Gesamtanzahl Produkte
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {isLoading ? '...' : inventoryStatus.total}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Produkte mit geringem Bestand
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="warning.main">
                      {isLoading ? '...' : inventoryStatus.lowStock}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Nicht vorrätige Produkte
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="error.main">
                      {isLoading ? '...' : inventoryStatus.outOfStock}
                    </Typography>
                  </Box>
                </Box>

                <Button fullWidth variant="outlined" onClick={() => navigate('/inventory')}>
                  Inventar prüfen
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Home;
