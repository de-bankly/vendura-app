import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const BottleScanner = ({ onScanBottle, isLoading, products }) => {
  const [customBottleType, setCustomBottleType] = useState('');
  const [scanActive, setScanActive] = useState(false);

  // Handle scanning from predefined bottle types
  const handleQuickScan = bottleType => {
    onScanBottle(bottleType);
  };

  // Handle manual entry of bottle type
  const handleManualEntry = e => {
    e.preventDefault();
    if (customBottleType.trim()) {
      onScanBottle(customBottleType.trim());
      setCustomBottleType('');
    }
  };

  // Simulate scanner activation
  const handleToggleScanner = () => {
    setScanActive(!scanActive);

    // If activating scanner, simulate a scan after 2 seconds
    if (!scanActive) {
      setTimeout(() => {
        // Randomly select a product to simulate scanner recognizing it
        if (products && products.length > 0) {
          const randomIndex = Math.floor(Math.random() * products.length);
          onScanBottle(products[randomIndex].name);
        }
        setScanActive(false);
      }, 2000);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Flasche scannen
      </Typography>

      {/* Scanner Simulation */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: scanActive ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background-color 0.3s ease',
        }}
      >
        {scanActive && (
          <Box
            sx={{
              position: 'absolute',
              height: '2px',
              width: '100%',
              backgroundColor: 'primary.main',
              animation: 'scanMove 2s infinite',
            }}
          />
        )}

        <Box sx={{ textAlign: 'center' }}>
          <IconButton
            color={scanActive ? 'success' : 'primary'}
            sx={{ mb: 1, fontSize: '3rem', p: 2 }}
            onClick={handleToggleScanner}
            disabled={isLoading}
          >
            <QrCodeScannerIcon fontSize="inherit" />
          </IconButton>
          <Typography>{scanActive ? 'Scannen...' : 'Scanner aktivieren'}</Typography>
        </Box>

        <Box
          sx={{
            '@keyframes scanMove': {
              '0%': { top: '0%' },
              '50%': { top: '100%' },
              '100%': { top: '0%' },
            },
          }}
        />
      </Paper>

      {/* Quick Scan Buttons */}
      <Typography variant="subtitle2" gutterBottom>
        Schnellauswahl
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      ) : products && products.length > 0 ? (
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {products.slice(0, 8).map(product => (
            <Grid item xs={6} key={product.id}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleQuickScan(product.name)}
                disabled={isLoading}
                sx={{
                  textTransform: 'none',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  height: '100%',
                }}
              >
                <Box>
                  <Typography variant="body2" noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.connectedProducts.length} Pfandprodukt(e)
                  </Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Keine Produkte mit Pfand verfügbar
        </Typography>
      )}

      {/* Manual Entry */}
      <Typography variant="subtitle2" gutterBottom>
        Manuelle Eingabe
      </Typography>

      <form onSubmit={handleManualEntry}>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Produktname eingeben"
            value={customBottleType}
            onChange={e => setCustomBottleType(e.target.value)}
            disabled={isLoading}
            sx={{ mr: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !customBottleType.trim()}
          >
            Scannen
          </Button>
        </Box>
      </form>
    </Box>
  );
};

BottleScanner.propTypes = {
  onScanBottle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  products: PropTypes.array,
};

BottleScanner.defaultProps = {
  isLoading: false,
  products: [],
};

export default BottleScanner;
