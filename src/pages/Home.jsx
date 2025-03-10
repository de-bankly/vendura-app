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
  useTheme,
  Stack,
  Paper,
  alpha,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';
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

  // Mock-Daten für das Dashboard
  const salesData = {
    today: 1250.75,
    yesterday: 980.5,
    trend: 27.56,
    positive: true,
  };

  const inventoryData = {
    total: 1876,
    lowStock: 12,
    outOfStock: 3,
    newItems: 8,
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

  const lowStockItems = [
    { id: 'P-567', name: 'Premium Kaffee 500g', stock: 5, threshold: 10 },
    { id: 'P-238', name: 'Bio Vollmilch 1L', stock: 8, threshold: 15 },
    { id: 'P-912', name: 'Frische Brötchen 6er', stock: 3, threshold: 20 },
    { id: 'P-345', name: 'Mineralwasser 6x1L', stock: 4, threshold: 12 },
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
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Stat card with gradient background
  const StatCard = ({ icon, title, value, trend, trendValue, trendLabel, color, onClick }) => {
    const IconComponent = icon;

    return (
      <motion.div variants={itemVariants}>
        <Card sx={cardStyle}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              background: `linear-gradient(135deg, transparent 30%, ${alpha(theme.palette[color].light, 0.2)})`,
              zIndex: 0,
            }}
          />
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette[color].main, 0.12),
                  color: theme.palette[color].main,
                  mr: 2,
                  width: 48,
                  height: 48,
                  boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
                  background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
                }}
              >
                <IconComponent />
              </Avatar>
              <Typography variant="h6" color="text.secondary">
                {title}
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ mb: 1.5, fontWeight: 700 }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={`${trendValue}%`}
                  size="small"
                  color={trend === 'up' ? 'success' : 'error'}
                  sx={{
                    mr: 1,
                    fontWeight: 600,
                    boxShadow: `0 2px 8px ${alpha(
                      theme.palette[trend === 'up' ? 'success' : 'error'].main,
                      0.3
                    )}`,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {trendLabel}
                </Typography>
              </Box>
            )}
            {onClick && (
              <Button
                variant="text"
                color={color}
                endIcon={<ArrowForwardIcon />}
                onClick={onClick}
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  p: 0,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Details anzeigen
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ pb: 5 }}>
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mb: 4,
            pb: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 800,
                color: 'text.primary',
                background: 'linear-gradient(90deg, #1E293B, #334155)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Willkommen zurück!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hier ist Ihre Übersicht für heute, den{' '}
              {new Date().toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PointOfSaleIcon />}
              onClick={() => navigate('/pos')}
              sx={{
                borderRadius: 10,
                px: 3,
                py: 1,
                fontWeight: 600,
                boxShadow: '0 8px 16px 0 rgba(37, 99, 235, 0.2)',
                background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 20px 0 rgba(37, 99, 235, 0.3)',
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                },
              }}
            >
              Zur Kasse
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<InventoryIcon />}
              onClick={() => navigate('/inventory')}
              sx={{
                borderRadius: 10,
                px: 3,
                py: 1,
                fontWeight: 600,
                borderWidth: '1.5px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px 0 rgba(37, 99, 235, 0.15)',
                  borderWidth: '1.5px',
                },
              }}
            >
              Zum Lager
            </Button>
          </Stack>
        </Box>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              icon={PointOfSaleIcon}
              title="Tagesumsatz"
              value={`€${salesData.today.toFixed(2)}`}
              trend={salesData.positive ? 'up' : 'down'}
              trendValue={salesData.trend}
              trendLabel={`vs. Gestern (€${salesData.yesterday.toFixed(2)})`}
              color="primary"
              onClick={() => navigate('/pos')}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              icon={InventoryIcon}
              title="Lagerbestand"
              value={`${inventoryData.total} Artikel`}
              color="secondary"
              onClick={() => navigate('/inventory')}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              icon={WarningAmberIcon}
              title="Kritischer Bestand"
              value={`${inventoryData.lowStock} Artikel`}
              color="warning"
              onClick={() => navigate('/inventory')}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              icon={ShoppingCartIcon}
              title="Neue Artikel"
              value={`${inventoryData.newItems} Artikel`}
              color="info"
              onClick={() => navigate('/inventory')}
            />
          </Grid>
        </Grid>
      </motion.div>

      {/* Recent Transactions and Low Stock */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Grid container spacing={3}>
          {/* Recent Transactions */}
          <Grid item xs={12} lg={7}>
            <motion.div variants={itemVariants}>
              <Card sx={cardStyle}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          mr: 1.5,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        }}
                      >
                        <ReceiptLongIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Letzte Transaktionen
                      </Typography>
                    </Box>
                  }
                  action={
                    <Tooltip title="Mehr Optionen">
                      <IconButton
                        aria-label="settings"
                        sx={{
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'rotate(90deg)',
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <List sx={{ '& .MuiListItem-root': { px: 2 } }}>
                    {recentTransactions.map((transaction, index) => (
                      <Box key={transaction.id}>
                        <ListItem
                          secondaryAction={
                            <Chip
                              icon={
                                transaction.status === 'completed' ? (
                                  <CheckCircleIcon fontSize="small" />
                                ) : (
                                  <WarningAmberIcon fontSize="small" />
                                )
                              }
                              label={
                                transaction.status === 'completed' ? 'Abgeschlossen' : 'Ausstehend'
                              }
                              size="small"
                              color={transaction.status === 'completed' ? 'success' : 'warning'}
                              sx={{
                                fontWeight: 600,
                                '& .MuiChip-icon': { ml: 0.5 },
                                boxShadow: `0 2px 8px ${alpha(
                                  theme.palette[
                                    transaction.status === 'completed' ? 'success' : 'warning'
                                  ].main,
                                  0.3
                                )}`,
                              }}
                            />
                          }
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.04),
                              transform: 'translateX(4px)',
                              cursor: 'pointer',
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {transaction.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                  {transaction.time}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="body2">{transaction.customer}</Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    ml: 'auto',
                                    fontWeight: 600,
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  €{transaction.amount.toFixed(2)}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < recentTransactions.length - 1 && <Divider sx={{ my: 0.5 }} />}
                      </Box>
                    ))}
                  </List>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="text"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/pos')}
                      sx={{
                        fontWeight: 600,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      Alle Transaktionen anzeigen
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Low Stock Items */}
          <Grid item xs={12} lg={5}>
            <motion.div variants={itemVariants}>
              <Card sx={cardStyle}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.error.main, 0.12),
                          color: theme.palette.error.main,
                          mr: 1.5,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                          background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                        }}
                      >
                        <StorefrontIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Artikel mit niedrigem Bestand
                      </Typography>
                    </Box>
                  }
                  action={
                    <Tooltip title="Mehr Optionen">
                      <IconButton
                        aria-label="settings"
                        sx={{
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'rotate(90deg)',
                            color: theme.palette.error.main,
                          },
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <List sx={{ '& .MuiListItem-root': { px: 2 } }}>
                    {lowStockItems.map((item, index) => (
                      <Box key={item.id}>
                        <ListItem
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.04),
                              transform: 'translateX(4px)',
                              cursor: 'pointer',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.12),
                                color: theme.palette.error.main,
                                width: 40,
                                height: 40,
                                mr: 2,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
                                background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                              }}
                            >
                              <WarningAmberIcon fontSize="small" />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {item.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="error"
                                  sx={{ ml: 'auto', fontWeight: 600 }}
                                >
                                  {item.stock} / {item.threshold}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(item.stock / item.threshold) * 100}
                                color="error"
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: alpha(theme.palette.error.main, 0.12),
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundImage: `linear-gradient(90deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                        </ListItem>
                        {index < lowStockItems.length - 1 && <Divider sx={{ my: 0.5 }} />}
                      </Box>
                    ))}
                  </List>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="text"
                      color="error"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/inventory')}
                      sx={{
                        fontWeight: 600,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      Zum Lagerbestand
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Additional Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #1E293B, #334155)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Analysen & Berichte
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Card sx={cardStyle}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.12),
                            color: theme.palette.info.main,
                            mr: 1.5,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`,
                            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                          }}
                        >
                          <BarChartIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Umsatzentwicklung
                        </Typography>
                      </Box>
                    }
                    action={
                      <Tooltip title="Mehr Optionen">
                        <IconButton
                          aria-label="settings"
                          sx={{
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'rotate(90deg)',
                              color: theme.palette.info.main,
                            },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <CardContent>
                    <Box
                      sx={{
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.info.main, 0.04),
                        borderRadius: 3,
                        p: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                        },
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Hier würde ein Umsatz-Chart angezeigt werden
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        variant="text"
                        color="info"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          fontWeight: 600,
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        Detaillierte Analyse
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Card sx={cardStyle}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.12),
                            color: theme.palette.success.main,
                            mr: 1.5,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                          }}
                        >
                          <DonutLargeIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Produktkategorien
                        </Typography>
                      </Box>
                    }
                    action={
                      <Tooltip title="Mehr Optionen">
                        <IconButton
                          aria-label="settings"
                          sx={{
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'rotate(90deg)',
                              color: theme.palette.success.main,
                            },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <CardContent>
                    <Box
                      sx={{
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.success.main, 0.04),
                        borderRadius: 3,
                        p: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                        },
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Hier würde ein Kategorien-Chart angezeigt werden
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        variant="text"
                        color="success"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          fontWeight: 600,
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        Kategorieübersicht
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Home;
