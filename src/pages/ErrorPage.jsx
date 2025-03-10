import { useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  useTheme,
  alpha,
  Divider,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';

/**
 * Page that throws an error during rendering to test the RouterErrorBoundary
 * This component will throw an error when the throwError parameter is present in the URL
 */
const ErrorPage = () => {
  const theme = useTheme();
  const searchParams = new URLSearchParams(window.location.search);
  const shouldThrowError = searchParams.has('throwError');

  useEffect(() => {
    // Log that the component is about to throw an error
    if (shouldThrowError) {
      console.log('ErrorPage is about to throw an error due to throwError parameter');
    }
  }, [shouldThrowError]);

  // Animation variants
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

  // Throw an error if the throwError parameter is present
  if (shouldThrowError) {
    throw new Error('This is a simulated route error triggered by the throwError parameter');
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              <ErrorOutlineIcon
                sx={{
                  fontSize: 80,
                  color: 'warning.main',
                  mb: 2,
                  filter: 'drop-shadow(0 4px 6px rgba(245, 158, 11, 0.3))',
                }}
              />
            </motion.div>

            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Route Error Test Page
            </Typography>

            <Typography
              variant="body1"
              paragraph
              sx={{
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                color: theme.palette.text.secondary,
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              Diese Seite demonstriert, wie der RouterErrorBoundary funktioniert. Fügen Sie den
              Parameter{' '}
              <Box
                component="code"
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.dark,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                }}
              >
                ?throwError
              </Box>{' '}
              zur URL hinzu, um einen Fehler auszulösen.
            </Typography>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              mb: 4,
              boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
              },
              background: `radial-gradient(circle at 90% 10%, ${alpha(theme.palette.warning.light, 0.1)} 0%, transparent 60%)`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <WarningIcon
                sx={{
                  color: theme.palette.warning.main,
                  mr: 2,
                  fontSize: '2rem',
                }}
              />
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Was passiert, wenn ein Fehler auftritt?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Wenn ein Fehler während des Renderns einer Route auftritt, fängt der
                  RouterErrorBoundary den Fehler ab und zeigt eine benutzerfreundliche Fehlermeldung
                  an, anstatt die gesamte Anwendung abstürzen zu lassen.
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                my: 3,
                '&::before, &::after': {
                  borderColor: alpha(theme.palette.warning.main, 0.2),
                },
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <BugReportIcon
                sx={{
                  color: theme.palette.warning.main,
                  mr: 2,
                  fontSize: '2rem',
                }}
              />
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Warum ist das wichtig?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Error Boundaries sind ein wichtiger Teil der React-Fehlerbehandlung. Sie
                  ermöglichen es Ihrer Anwendung, Rendering-Fehler elegant zu behandeln und eine
                  bessere Benutzererfahrung zu bieten, selbst wenn etwas schief geht.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              border: `1px dashed ${alpha(theme.palette.warning.main, 0.3)}`,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CodeIcon sx={{ color: theme.palette.warning.main, mr: 2, fontSize: '2rem' }} />
            <Typography variant="body1" color="text.secondary">
              <Box component="span" sx={{ fontWeight: 600, color: theme.palette.warning.dark }}>
                Tipp:
              </Box>{' '}
              Sie können auch die Komponenten-Fehlerbehandlung auf der Error-Test-Seite
              ausprobieren.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Tooltip title="Löst einen Fehler aus, der von RouterErrorBoundary abgefangen wird">
              <Button
                variant="contained"
                color="warning"
                href={`${window.location.pathname}?throwError`}
                startIcon={<ErrorOutlineIcon />}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 10,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)',
                  background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                    boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                  },
                }}
              >
                Fehler auslösen
              </Button>
            </Tooltip>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              color="warning"
              href="/error-test"
              startIcon={<BugReportIcon />}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 10,
                fontWeight: 600,
                borderWidth: '1.5px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderWidth: '1.5px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
                },
              }}
            >
              Zum Komponenten-Fehlertest
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default ErrorPage;
