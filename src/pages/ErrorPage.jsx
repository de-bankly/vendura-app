import BugReportIcon from '@mui/icons-material/BugReport';
import CodeIcon from '@mui/icons-material/Code';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningIcon from '@mui/icons-material/Warning';
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

/**
 * @description Page that throws an error during rendering to test the RouterErrorBoundary.
 * This component will throw an error when the `throwError` parameter is present in the URL.
 * @returns {JSX.Element} The ErrorPage component.
 */
const ErrorPage = () => {
  const theme = useTheme();
  const searchParams = new URLSearchParams(window.location.search);
  const shouldThrowError = searchParams.has('throwError');

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
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 8 },
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
                    color: 'primary.main',
                    mb: 2,
                    filter: 'drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))',
                  }}
                />
              </motion.div>

              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0F172A, #334155)',
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
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
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

            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: theme.shape.borderRadius * 1.5,
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
                    background: 'linear-gradient(90deg, #0F172A, #334155, #64748B)',
                  },
                  background: `radial-gradient(circle at 90% 10%, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 60%)`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <WarningIcon
                    sx={{
                      color: theme.palette.primary.main,
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
                      RouterErrorBoundary den Fehler ab und zeigt eine benutzerfreundliche
                      Fehlermeldung an, anstatt die gesamte Anwendung abstürzen zu lassen.
                    </Typography>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    my: 3,
                    '&::before, &::after': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <BugReportIcon
                    sx={{
                      color: theme.palette.primary.main,
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
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CodeIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: '2rem' }} />
                <Typography variant="body1" color="text.secondary">
                  <Box component="span" sx={{ fontWeight: 600, color: theme.palette.primary.dark }}>
                    Tipp:
                  </Box>{' '}
                  Error Boundaries sind ein wichtiger Teil der React-Fehlerbehandlung.
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
                    color="primary"
                    href={`${window.location.pathname}?throwError`}
                    startIcon={<ErrorOutlineIcon />}
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
                    Fehler auslösen
                  </Button>
                </Tooltip>
              </motion.div>
            </motion.div>
          </motion.div>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ErrorPage;
