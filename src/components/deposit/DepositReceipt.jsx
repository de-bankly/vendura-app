import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { QRCodeSVG } from '@qrcode/react';

const DepositReceipt = ({ receipt }) => {
  // Format date string
  const formatDate = dateString => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Current date if no receipt date
  const receiptDate = new Date();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: '#FFFFFF',
        border: '1px dashed #DDD',
        position: 'relative',
      }}
    >
      {/* Receipt Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Pfand Rückgabebeleg
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(receiptDate)}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Receipt Info */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Beleg-Nr.:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {receipt?.id || '000000000'}
          </Typography>
        </Box>

        <Chip
          label={receipt?.redeemed ? 'Eingelöst' : 'Nicht eingelöst'}
          color={receipt?.redeemed ? 'default' : 'success'}
          size="small"
          sx={{ height: 24 }}
        />
      </Box>

      {/* Items Table */}
      <TableContainer component={Box} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Artikel</TableCell>
              <TableCell align="center">Anzahl</TableCell>
              <TableCell align="right">Pfand</TableCell>
              <TableCell align="right">Summe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receipt?.positions?.map((position, idx) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {position.product.name}
                </TableCell>
                <TableCell align="center">{position.quantity}</TableCell>
                <TableCell align="right">{position.product.price.toFixed(2)} €</TableCell>
                <TableCell align="right">
                  {(position.product.price * position.quantity).toFixed(2)} €
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ mb: 2 }} />

      {/* Total Amount */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Gesamtbetrag:</Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {receipt?.total?.toFixed(2) || '0.00'} €
        </Typography>
      </Box>

      {/* QR Code */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <QRCodeSVG
          value={receipt?.id || 'https://example.com/deposit/'}
          size={150}
          level="H"
          includeMargin
        />
      </Box>

      {/* Footer Text */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Dieser Beleg kann an der Kasse eingelöst werden.
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Gültig bis: {formatDate(new Date(receiptDate.getTime() + 30 * 24 * 60 * 60 * 1000))}
        </Typography>
      </Box>
    </Paper>
  );
};

DepositReceipt.propTypes = {
  receipt: PropTypes.shape({
    id: PropTypes.string,
    positions: PropTypes.arrayOf(
      PropTypes.shape({
        quantity: PropTypes.number.isRequired,
        product: PropTypes.object.isRequired,
      })
    ),
    redeemed: PropTypes.bool,
    total: PropTypes.number,
  }),
};

export default DepositReceipt;
