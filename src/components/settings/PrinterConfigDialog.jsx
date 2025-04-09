import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { PrinterService } from '../../services';
import PrintIcon from '@mui/icons-material/Print';
import UsbIcon from '@mui/icons-material/Usb';

const PrinterConfigDialog = ({ open, onClose }) => {
  const [baudRate, setBaudRate] = useState(9600);
  const [printerWidth, setPrinterWidth] = useState(48);
  const [testStatus, setTestStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);

  // Check printer connection on dialog open
  useEffect(() => {
    if (open) {
      checkPrinterConnection();
    }
  }, [open]);

  // Check if Web Serial API is supported
  const isWebSerialSupported = () => {
    return !!navigator.serial;
  };

  // Check if printer is connected
  const checkPrinterConnection = async () => {
    if (!isWebSerialSupported()) {
      setTestStatus('unsupported');
      return;
    }

    setIsLoading(true);
    try {
      const isConnected = await PrinterService.isPrinterConnected();
      setPrinterConnected(isConnected);
      setTestStatus(isConnected ? 'success' : 'error');
    } catch (error) {
      console.error('Error checking printer connection:', error);
      setPrinterConnected(false);
      setTestStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to printer
  const handleConnectPrinter = async () => {
    setIsLoading(true);
    try {
      const connected = await PrinterService.connectToPrinter();
      setPrinterConnected(connected);
      setTestStatus(connected ? 'success' : 'error');
    } catch (error) {
      console.error('Error connecting to printer:', error);
      setTestStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Print test page
  const handlePrintTest = async () => {
    setIsTesting(true);
    setTestStatus('');

    try {
      const success = await PrinterService.printTestPage();
      setTestStatus(success ? 'success' : 'error');
    } catch (error) {
      console.error('Error printing test page:', error);
      setTestStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  // Save printer settings
  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center">
          <PrintIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Drucker-Konfiguration</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Konfigurieren Sie Ihren EPOS Z58B Thermal-Drucker für den Belegdruck. Verbinden Sie den
            Drucker über USB und geben Sie die Zugriffserlaubnis.
          </Typography>

          {testStatus === 'unsupported' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Web Serial API wird von Ihrem Browser nicht unterstützt. Bitte verwenden Sie Chrome,
              Edge oder ein anderes Chromium-basiertes Browser.
            </Alert>
          )}

          {testStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Drucker ist verbunden und einsatzbereit.
            </Alert>
          )}

          {testStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Drucker ist nicht verbunden. Bitte überprüfen Sie die Verbindung und Stromversorgung.
            </Alert>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Baudrate</InputLabel>
              <Select value={baudRate} onChange={e => setBaudRate(e.target.value)} label="Baudrate">
                <MenuItem value={9600}>9600 (Standard)</MenuItem>
                <MenuItem value={19200}>19200</MenuItem>
                <MenuItem value={38400}>38400</MenuItem>
                <MenuItem value={57600}>57600</MenuItem>
                <MenuItem value={115200}>115200</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Druckerbreite</InputLabel>
              <Select
                value={printerWidth}
                onChange={e => setPrinterWidth(e.target.value)}
                label="Druckerbreite"
              >
                <MenuItem value={32}>32 Zeichen (Schmal)</MenuItem>
                <MenuItem value={42}>42 Zeichen (Standard)</MenuItem>
                <MenuItem value={48}>48 Zeichen (58mm Papier)</MenuItem>
                <MenuItem value={64}>64 Zeichen (Breit)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', my: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UsbIcon />}
                onClick={handleConnectPrinter}
                disabled={isLoading || !isWebSerialSupported()}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Verbinde...
                  </>
                ) : (
                  'Mit Drucker verbinden'
                )}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<PrintIcon />}
                onClick={handlePrintTest}
                disabled={isTesting || isLoading || !printerConnected}
              >
                {isTesting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Drucke...
                  </>
                ) : (
                  'Testseite drucken'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Abbrechen
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={isLoading || isTesting}
        >
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrinterConfigDialog;
