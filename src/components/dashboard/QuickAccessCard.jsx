import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha, Avatar, Button, Card, CardContent, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

/**
 * Reusable card component for quick access links on the dashboard.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.icon - Icon element to display.
 * @param {string} props.title - Card title.
 * @param {string} props.description - Card description.
 * @param {string} props.path - Target path for navigation.
 * @param {'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'} [props.color='primary'] - Color theme for the card. Defaults to 'primary'.
 * @returns {React.ReactElement} The rendered QuickAccessCard component.
 */
const QuickAccessCard = ({ icon, title, description, path, color = 'primary' }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const avatarBgColor = alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.1);
  const avatarColor = `${color}.main`;
  const buttonColor = color;

  return (
    <motion.div variants={itemVariants} style={{ height: '100%' }}>
      <Card sx={{ height: '100%' }}>
        <CardContent
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Avatar
            sx={{
              bgcolor: avatarBgColor,
              color: avatarColor,
              mb: 2,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, flexGrow: 0 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {description}
          </Typography>
          <Button
            variant="text"
            color={buttonColor}
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate(path)}
            sx={{ p: 0, alignSelf: 'flex-start' }}
          >
            Öffnen
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickAccessCard;
