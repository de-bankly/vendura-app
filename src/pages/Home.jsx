import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

  return (
    <Box>
      {/* Dashboard Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Übersicht über Verkäufe und Lagerbestand
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <PointOfSaleIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Tagesumsatz
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                €{salesData.today.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={salesData.positive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={`${salesData.trend}%`}
                  size="small"
                  color={salesData.positive ? 'success' : 'error'}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  vs. Gestern (€{salesData.yesterday.toFixed(2)})
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                  <InventoryIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Lagerbestand
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                {inventoryData.total} Artikel
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={<WarningAmberIcon />}
                  label={`${inventoryData.lowStock} wenig auf Lager`}
                  size="small"
                  color="warning"
                  sx={{ mr: 1 }}
                />
                <Chip
                  icon={<WarningAmberIcon />}
                  label={`${inventoryData.outOfStock} nicht verfügbar`}
                  size="small"
                  color="error"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Schnellzugriff
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<PointOfSaleIcon />}
                onClick={() => navigate('/pos')}
                sx={{ mb: 2 }}
              >
                Zur Kasse
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<InventoryIcon />}
                onClick={() => navigate('/inventory')}
              >
                Zum Lager
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* New Items Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                  <ShoppingCartIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Neue Artikel
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                {inventoryData.newItems} Artikel
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/inventory')}
                  size="small"
                >
                  Details anzeigen
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions and Low Stock */}
      <Grid container spacing={3}>
        {/* Recent Transactions */}
        <Grid item xs={12} lg={7}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardHeader
              title="Letzte Transaktionen"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              <List>
                {recentTransactions.map((transaction, index) => (
                  <Box key={transaction.id}>
                    <ListItem
                      secondaryAction={
                        <Chip
                          icon={
                            transaction.status === 'completed' ? (
                              <CheckCircleIcon />
                            ) : (
                              <WarningAmberIcon />
                            )
                          }
                          label={
                            transaction.status === 'completed' ? 'Abgeschlossen' : 'Ausstehend'
                          }
                          size="small"
                          color={transaction.status === 'completed' ? 'success' : 'warning'}
                        />
                      }
                      sx={{ py: 1.5 }}
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
                            <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 600 }}>
                              €{transaction.amount.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentTransactions.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/pos')}
                >
                  Alle Transaktionen anzeigen
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Items */}
        <Grid item xs={12} lg={5}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardHeader
              title="Artikel mit niedrigem Bestand"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              <List>
                {lowStockItems.map((item, index) => (
                  <Box key={item.id}>
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'error.light', width: 32, height: 32 }}>
                          <WarningAmberIcon fontSize="small" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ ml: 2, fontWeight: 600 }}
                            >
                              {item.stock} / {item.threshold}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(item.stock / item.threshold) * 100}
                              color="error"
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < lowStockItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/inventory')}
                >
                  Zum Lagerbestand
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
