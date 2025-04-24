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
import { QRCodeSVG } from 'qrcode.react';

/**
 * Formats a date string or Date object into a German locale string (DD.MM.YYYY, HH:mm).
 * @param {string | Date} dateInput - The date string or Date object to format.
 * @returns {string} The formatted date string.
 */
const formatDate = dateInput => {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Renders a deposit receipt component.
 * Displays receipt details including items, total amount, QR code, and status.
 *
 * @param {object} props - The component props.
 * @param {object} [props.receipt] - The receipt data object.
 * @param {string} [props.receipt.id] - The unique identifier of the receipt.
 * @param {Array<object>} [props.receipt.positions] - List of items returned.
 * @param {number} props.receipt.positions[].quantity - Quantity of the item.
 * @param {object} props.receipt.positions[].product - Product details.
 * @param {string} props.receipt.positions[].product.name - Name of the product.
 * @param {number} props.receipt.positions[].product.price - Price (deposit value) of the product.
 * @param {boolean} [props.receipt.redeemed] - Whether the receipt has been redeemed.
 * @param {number} [props.receipt.total] - The total deposit amount.
 * @returns {React.ReactElement} The rendered deposit receipt component.
 */
const DepositReceipt = ({ receipt }) => {
  const receiptDate = new Date(); // Use current date for display and validity calculation

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
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Pfand Rückgabebeleg
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(receiptDate)}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Gesamtbetrag:</Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {receipt?.total?.toFixed(2) || '0.00'} €
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <QRCodeSVG
          value={receipt?.id || 'https://example.com/deposit/'}
          size={150}
          level="H"
          includeMargin
        />
      </Box>

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
        product: PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
        }).isRequired,
      })
    ),
    redeemed: PropTypes.bool,
    total: PropTypes.number,
  }),
};

export default DepositReceipt;
