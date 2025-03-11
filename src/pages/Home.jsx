import { useTheme, alpha } from '@mui/material';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress,
  Chip,
  Stack,
  Paper,
} from '../components/ui';
import { Tooltip } from '../components/ui/modals';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BarChartIcon from '@mui/icons-material/BarChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Mock-Daten für die Startseite
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

  // Card styles
  const cardStyle = {
    height: '100%',
    borderRadius: 2,
    boxShadow: '0 4px 20px 0 rgba(15, 23, 42, 0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 28px 0 rgba(15, 23, 42, 0.12)',
    },
    overflow: 'hidden',
    position: 'relative',
  };

  // Animation variants for staggered animations
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

  // Card with gradient background
  const GradientCard = ({ title, value, icon: Icon, trend, trendValue, onClick }) => {
    const gradientBg = `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.8
    )} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`;

    return (
      <Card
        sx={{
          ...cardStyle,
          background: gradientBg,
          color: 'white',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        {/* Decorative circles in background */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: alpha('#fff', 0.1),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            left: -30,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: alpha('#fff', 0.05),
          }}
        />

        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {value}
              </Typography>
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {trend === 'up' ? (
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {trendValue}
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: 'white',
                width: 48,
                height: 48,
              }}
            >
              <Icon />
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Willkommen bei Vendura
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hier finden Sie eine Übersicht über die wichtigsten Funktionen und Kennzahlen.
          </Typography>
        </Box>
      </motion.div>

      {/* Main Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                ...cardStyle,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                p: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  mr: { xs: 0, sm: 3 },
                  mb: { xs: 3, sm: 0 },
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Verkaufsbereich
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Starten Sie einen neuen Verkauf, verwalten Sie Transaktionen und erstellen Sie
                  Rechnungen.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PointOfSaleIcon />}
                  onClick={() => navigate('/sales')}
                  sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                >
                  Zum Verkauf
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: '50%',
                  p: 2,
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                }}
              >
                <PointOfSaleIcon
                  sx={{ fontSize: { xs: 48, sm: 64 }, color: theme.palette.primary.main }}
                />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                ...cardStyle,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                p: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  mr: { xs: 0, sm: 3 },
                  mb: { xs: 3, sm: 0 },
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Komponenten
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Entdecken Sie alle verfügbaren UI-Komponenten und deren Verwendungsmöglichkeiten.
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ViewModuleIcon />}
                  onClick={() => navigate('/showcase')}
                  sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                >
                  Zur Komponentenübersicht
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  borderRadius: '50%',
                  p: 2,
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                }}
              >
                <ViewModuleIcon
                  sx={{ fontSize: { xs: 48, sm: 64 }, color: theme.palette.secondary.main }}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Verkaufsübersicht
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <GradientCard
                icon={PointOfSaleIcon}
                title="Heutiger Umsatz"
                value={`${salesData.today.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                })}`}
                trend={salesData.positive ? 'up' : 'down'}
                trendValue={`${salesData.trend}% seit gestern`}
                onClick={() => navigate('/sales')}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <GradientCard
                icon={ShoppingCartIcon}
                title="Transaktionen"
                value="24 heute"
                trend="up"
                trendValue="12% seit gestern"
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <GradientCard
                icon={ReceiptLongIcon}
                title="Durchschn. Bestellung"
                value="52,11 €"
                trend="up"
                trendValue="8% seit letzter Woche"
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <GradientCard
                icon={StorefrontIcon}
                title="Aktive Kunden"
                value="128"
                trend="up"
                trendValue="5% seit letztem Monat"
              />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Card sx={cardStyle}>
                <CardHeader
                  title="Letzte Transaktionen"
                  action={
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  <List sx={{ p: 0 }}>
                    {recentTransactions.map((transaction, index) => (
                      <React.Fragment key={transaction.id}>
                        <ListItem
                          sx={{
                            px: 3,
                            py: 2,
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor:
                                  transaction.status === 'completed'
                                    ? 'success.light'
                                    : 'warning.light',
                                color:
                                  transaction.status === 'completed'
                                    ? 'success.dark'
                                    : 'warning.dark',
                                mr: 2,
                              }}
                            >
                              {transaction.status === 'completed' ? (
                                <CheckCircleIcon />
                              ) : (
                                <WarningAmberIcon />
                              )}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  mb: 0.5,
                                }}
                              >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {transaction.customer}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {transaction.amount.toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                  })}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography variant="body2" color="text.secondary">
                                  {transaction.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {transaction.time} Uhr
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </ListItem>
                        {index < recentTransactions.length - 1 && (
                          <Divider sx={{ mx: 3 }} component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/sales')}
                    size="small"
                  >
                    Alle Transaktionen anzeigen
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  title="Verkaufsstatistik"
                  action={
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 250,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        sx={{
                          position: 'absolute',
                          width: '70%',
                          height: '70%',
                          borderRadius: '50%',
                          background: `conic-gradient(
                            ${theme.palette.primary.main} 0% 35%, 
                            ${theme.palette.secondary.main} 35% 60%, 
                            ${theme.palette.success.main} 60% 75%, 
                            ${theme.palette.warning.main} 75% 100%
                          )`,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          width: '50%',
                          height: '50%',
                          borderRadius: '50%',
                          bgcolor: 'background.paper',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          Gesamt
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: theme.palette.primary.main,
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2">Verkauf vor Ort (35%)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: theme.palette.secondary.main,
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2">Online-Verkauf (25%)</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: theme.palette.success.main,
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2">Großhandel (15%)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: theme.palette.warning.main,
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2">Sonstige (25%)</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/sales')}
                    size="small"
                  >
                    Detaillierte Statistiken
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Home;
