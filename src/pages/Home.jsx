import React from 'react';
import { useTheme, alpha } from '@mui/material';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Paper,
  Divider,
  Chip,
} from '../components/ui';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Mock data for the dashboard
  const salesData = {
    today: 1250.75,
    yesterday: 980.5,
    trend: 27.56,
    positive: true,
  };

  const inventoryStatus = {
    total: 287,
    lowStock: 12,
    outOfStock: 3,
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="slide-up"
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Quick Access Cards - First Row */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={3}>
                <motion.div variants={itemVariants}>
                  <Card className="hover-card" sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          mb: 2,
                        }}
                      >
                        <PointOfSaleIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Verkauf
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Kasse öffnen und Verkäufe tätigen
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/sales')}
                        sx={{ p: 0 }}
                      >
                        Öffnen
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <motion.div variants={itemVariants}>
                  <Card className="hover-card" sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: 'secondary.main',
                          mb: 2,
                        }}
                      >
                        <InventoryIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Inventar
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Produkte verwalten und bearbeiten
                      </Typography>
                      <Button
                        variant="text"
                        color="secondary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/inventory')}
                        sx={{ p: 0 }}
                      >
                        Öffnen
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <motion.div variants={itemVariants}>
                  <Card className="hover-card" sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: 'success.main',
                          mb: 2,
                        }}
                      >
                        <CardGiftcardIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Gutscheine
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Gutscheine erstellen und einlösen
                      </Typography>
                      <Button
                        variant="text"
                        color="success"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/giftcards')}
                        sx={{ p: 0 }}
                      >
                        Öffnen
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <motion.div variants={itemVariants}>
                  <Card className="hover-card" sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: 'warning.main',
                          mb: 2,
                        }}
                      >
                        <LocalOfferIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Angebote
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Rabatte und Angebote verwalten
                      </Typography>
                      <Button
                        variant="text"
                        color="warning"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/vouchers')}
                        sx={{ p: 0 }}
                      >
                        Öffnen
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>

          {/* Sales Overview Card */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card className="hover-card" sx={{ height: '100%' }}>
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
        className="slide-up"
      >
        <Grid container spacing={3}>
          {/* Recent Transactions */}
          <Grid item xs={12} md={8}>
            <Card className="hover-card">
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
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/sales/transactions')}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Alle Transaktionen
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Inventory Status */}
          <Grid item xs={12} md={4}>
            <Card className="hover-card" sx={{ height: '100%' }}>
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
                      {inventoryStatus.total}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Produkte mit geringem Bestand
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="warning.main">
                      {inventoryStatus.lowStock}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Nicht vorrätige Produkte
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="error.main">
                      {inventoryStatus.outOfStock}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/inventory')}
                  startIcon={<InventoryIcon />}
                >
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
