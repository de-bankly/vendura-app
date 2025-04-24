import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

/**
 * Enhanced 404 Not Found page
 * Provides helpful navigation options and suggestions to users
 * @returns {JSX.Element} The NotFound component.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const navigationSuggestions = [
    { text: 'Home Page', path: '/', icon: <HomeIcon fontSize="small" /> },
    { text: 'Verkauf', path: '/sales', icon: <PointOfSaleIcon fontSize="small" /> },
  ];

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

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 8,
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: theme.shape.borderRadius * 1.5,
            boxShadow: '0 10px 40px rgba(15, 23, 42, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #0F172A, #334155, #64748B)',
            },
            background: `radial-gradient(circle at 90% 10%, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 60%)`,
          }}
        >
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <SentimentDissatisfiedIcon
                  sx={{
                    fontSize: 100,
                    color: 'primary.main',
                    mb: 2,
                    filter: 'drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))',
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '5rem', md: '8rem' },
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0F172A, #334155)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                    mb: 2,
                    textShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
                  }}
                >
                  404
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  Seite nicht gefunden
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Die von Ihnen gesuchte Seite konnte nicht gefunden werden:{' '}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {location.pathname}
                  </Box>
                </Typography>
              </motion.div>
            </Box>

            <Divider
              sx={{
                my: 3,
                '&::before, &::after': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '""',
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        mr: 1,
                      },
                    }}
                  >
                    Was ist passiert?
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body2"
                    paragraph
                    sx={{
                      ml: 3,
                      borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      pl: 2,
                    }}
                  >
                    Die angeforderte Seite existiert nicht, wurde verschoben oder Sie haben
                    möglicherweise die URL falsch eingegeben.
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '""',
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        mr: 1,
                      },
                    }}
                  >
                    Was können Sie tun?
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body2"
                    paragraph
                    sx={{
                      ml: 3,
                      borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      pl: 2,
                    }}
                  >
                    Überprüfen Sie die URL auf Tippfehler, verwenden Sie das Navigationsmenü oder
                    probieren Sie einen der unten vorgeschlagenen Links aus.
                  </Typography>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '""',
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        mr: 1,
                      },
                    }}
                  >
                    Versuchen Sie stattdessen diese Seiten:
                  </Typography>
                </motion.div>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 3 }}>
                  {navigationSuggestions.map((item, index) => (
                    <motion.div key={item.path} variants={itemVariants} custom={index}>
                      <Button
                        component={RouterLink}
                        to={item.path}
                        variant="text"
                        color="primary"
                        startIcon={item.icon}
                        sx={{
                          justifyContent: 'flex-start',
                          borderRadius: 2,
                          py: 1,
                          px: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        {item.text}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    borderWidth: '1.5px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: '1.5px',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                    },
                  }}
                >
                  Zurück
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                    background: 'linear-gradient(135deg, #0F172A, #020617)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #334155, #0F172A)',
                      boxShadow: '0 6px 20px rgba(15, 23, 42, 0.35)',
                    },
                  }}
                >
                  Zur Startseite
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default NotFound;
