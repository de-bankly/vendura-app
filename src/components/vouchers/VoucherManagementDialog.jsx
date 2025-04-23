import AddIcon from '@mui/icons-material/Add';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { getAllVouchers } from '../../utils/voucherUtils';

import IssueVoucherDialog from './IssueVoucherDialog';

/**
 * Dialog component for managing vouchers
 */
const VoucherManagementDialog = ({ open, onClose }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  // Fetch vouchers on component mount
  useEffect(() => {
    if (open) {
      fetchVouchers();
    }
  }, [open]);

  // Fetch vouchers from API
  const fetchVouchers = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedVouchers = await getAllVouchers();
      setVouchers(fetchedVouchers);
    } catch (err) {
      setError('Fehler beim Laden der Gutscheine');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle copy to clipboard
  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle issue dialog open
  const handleIssueDialogOpen = () => {
    setIssueDialogOpen(true);
  };

  // Handle issue dialog close
  const handleIssueDialogClose = () => {
    setIssueDialogOpen(false);
    fetchVouchers(); // Refresh vouchers list
  };

  // Filter vouchers based on tab
  const filteredVouchers = vouchers.filter(voucher => {
    if (tabValue === 0) return true; // All vouchers
    if (tabValue === 1) return !voucher.isRedeemed; // Active vouchers
    if (tabValue === 2) return voucher.isRedeemed; // Redeemed vouchers
    return true;
  });

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CardGiftcardIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Gutscheinverwaltung</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleIssueDialogOpen}
            >
              Neuer Gutschein
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Alle Gutscheine" />
            <Tab label="Aktive Gutscheine" />
            <Tab label="Eingelöste Gutscheine" />
          </Tabs>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : filteredVouchers.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Keine Gutscheine gefunden
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Wert</TableCell>
                    <TableCell>Ausgestellt am</TableCell>
                    <TableCell>Gültig bis</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVouchers.map(voucher => (
                    <TableRow key={voucher.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>{voucher.id}</Box>
                      </TableCell>
                      <TableCell>{voucher.value.toFixed(2)} €</TableCell>
                      <TableCell>{voucher.issuedAt}</TableCell>
                      <TableCell>{voucher.expiresAt}</TableCell>
                      <TableCell>
                        {voucher.isRedeemed ? (
                          <Chip
                            label="Eingelöst"
                            color="default"
                            size="small"
                            icon={<CheckCircleIcon />}
                          />
                        ) : (
                          <Chip label="Aktiv" color="success" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyCode(voucher.id, voucher.id + '_copied')}
                          color={copiedId === voucher.id + '_copied' ? 'success' : 'default'}
                          disabled={voucher.isRedeemed}
                        >
                          {copiedId === voucher.id + '_copied' ? (
                            <CheckCircleIcon fontSize="small" />
                          ) : (
                            <ContentCopyIcon fontSize="small" />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Schließen
          </Button>
        </DialogActions>
      </Dialog>

      <IssueVoucherDialog open={issueDialogOpen} onClose={handleIssueDialogClose} />
    </>
  );
};

export default VoucherManagementDialog;
