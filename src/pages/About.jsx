import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Divider,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SpeedIcon from '@mui/icons-material/Speed';

const About = () => {
  const theme = useTheme();

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

  // Features data
  const features = [
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Sicherheit',
      description:
        'Modernste Verschlüsselungstechnologie zum Schutz Ihrer Daten und Transaktionen.',
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      title: 'Effizienz',
      description: 'Schnelle und reibungslose Transaktionen für ein optimales Benutzererlebnis.',
    },
    {
      icon: <SupportAgentIcon fontSize="large" />,
      title: 'Support',
      description: 'Unser engagiertes Support-Team steht Ihnen bei Fragen jederzeit zur Verfügung.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              textAlign: 'center',
              mb: 6,
              position: 'relative',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
                },
              }}
            >
              Über Vendura
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              Ein modernes Kassen- und Lagersystem, das Effizienz und Benutzerfreundlichkeit
              vereint.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={7}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: 'linear-gradient(180deg, #2563EB, #60A5FA)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '30%',
                    height: '100%',
                    background: `radial-gradient(circle at right top, ${alpha(theme.palette.primary.light, 0.08)} 0%, transparent 70%)`,
                    zIndex: 0,
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    Unsere Geschichte
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Vendura ist ein modernes Kassen- und Lagersystem, das entwickelt wurde, um
                    Unternehmen eine nahtlose und intuitive Verwaltungserfahrung zu bieten. Unsere
                    Plattform kombiniert modernste Technologie mit benutzerfreundlichem Design, um
                    die Verwaltung von Kasse und Lager zugänglich und effizient zu gestalten.
                  </Typography>

                  <Box sx={{ my: 4 }}>
                    <Divider
                      sx={{
                        my: 3,
                        '&::before, &::after': {
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    />
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            mr: 2,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                          }}
                        >
                          <TrackChangesIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600,
                            }}
                          >
                            Unsere Mission
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.6,
                              color: theme.palette.text.secondary,
                            }}
                          >
                            Die Verwaltungserfahrung durch innovative Technologie und
                            außergewöhnliche Benutzerfreundlichkeit zu transformieren und die
                            Kassen- und Lagerverwaltung einfach, sicher und zugänglich für alle zu
                            gestalten.
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            mr: 2,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.2)}`,
                          }}
                        >
                          <VisibilityIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              color: 'secondary.main',
                              fontWeight: 600,
                            }}
                          >
                            Unsere Vision
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.6,
                              color: theme.palette.text.secondary,
                            }}
                          >
                            Die führende digitale Plattform für Kassen- und Lagerverwaltung zu
                            werden, die für ihre Zuverlässigkeit, Sicherheit und ihren
                            benutzerzentrierten Ansatz bekannt ist.
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Features Section */}
          <Grid item xs={12} md={5}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
                  background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background: `radial-gradient(circle at left bottom, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 60%)`,
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      mb: 3,
                      textAlign: 'center',
                    }}
                  >
                    Unsere Vorteile
                  </Typography>

                  <Box sx={{ mt: 4 }}>
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        variants={itemVariants}
                        custom={index}
                        whileHover={{ x: 5 }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 8px 25px rgba(15, 23, 42, 0.1)',
                              transform: 'translateY(-4px)',
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              width: 56,
                              height: 56,
                              mr: 3,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                          >
                            {feature.icon}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                mb: 0.5,
                              }}
                            >
                              {feature.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ lineHeight: 1.6 }}
                            >
                              {feature.description}
                            </Typography>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <AccountBalanceIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                      Zuverlässigkeit & Qualität
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Wir legen größten Wert auf die Qualität und Zuverlässigkeit unserer Lösungen,
                      um Ihnen ein sorgenfreies Arbeiten zu ermöglichen.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default About;
