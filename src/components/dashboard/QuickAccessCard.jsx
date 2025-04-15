import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, alpha, Card, CardContent, Avatar, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

// Animation variant for the card item (can be passed down or defined here)
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
 * @param {'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'} [props.color='primary'] - Color theme for the card.
 */
const QuickAccessCard = ({
  icon,
  title,
  description,
  path,
  color = 'primary', // Default to primary
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Determine colors based on the 'color' prop
  const avatarBgColor = alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.1);
  const avatarColor = `${color}.main`;
  const buttonColor = color;

  return (
    <motion.div variants={itemVariants} style={{ height: '100%' }}>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
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
            sx={{ p: 0, alignSelf: 'flex-start' }} // Keep button at bottom left
          >
            Öffnen
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickAccessCard;
