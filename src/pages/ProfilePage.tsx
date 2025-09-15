import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { PyMEProfile, ProveedorProfile } from '../types';
import { pymeProfilePersistenceService, proveedorProfilePersistenceService } from '../services/dataPersistenceService';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PyMEProfile | ProveedorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        // Buscar perfil PyME primero
        const pymeProfile = pymeProfilePersistenceService.getProfileByUserId(user.id);
        
        if (pymeProfile) {
          setProfile(pymeProfile);
        } else {
          // Si no se encuentra perfil PyME, buscar perfil Proveedor
          const proveedorProfile = proveedorProfilePersistenceService.getProfileByUserId(user.id);
          if (proveedorProfile) {
            setProfile(proveedorProfile);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const isPyME = profile && 'companyName' in profile && 'industry' in profile;
  const isProveedor = profile && 'companyName' in profile && 'services' in profile;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Cargando perfil...</Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          No tienes un perfil creado
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Crea tu perfil para comenzar a usar la plataforma
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/profile-setup')}
          startIcon={<EditIcon />}
        >
          Crear Perfil
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: { xs: 2, sm: 3, md: 4 },
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.1)'
      }}>
        <Typography 
          variant="h3" 
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          👤 Mi Perfil
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditProfile}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }}
        >
          ✏️ Editar Perfil
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Información Principal */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: 'fit-content',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <CardContent sx={{ 
              textAlign: 'center', 
              p: 4,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              borderRadius: 4
            }}>
              <Avatar
                sx={{
                  width: 140,
                  height: 140,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  fontSize: '4rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                  border: '4px solid rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                  }
                }}
              >
                {profile.companyName?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                {profile.companyName}
              </Typography>
              <Chip
                label={isPyME ? '🏢 PyME' : '🔧 Proveedor'}
                color={isPyME ? 'primary' : 'secondary'}
                sx={{ 
                  mb: 3,
                  px: 2,
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: isPyME 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  border: `2px solid ${isPyME ? 'rgba(99, 102, 241, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                  '& .MuiChip-label': {
                    color: isPyME ? '#6366f1' : '#8b5cf6',
                    fontWeight: 600
                  }
                }}
              />
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  lineHeight: 1.6,
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                "{profile.description}"
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Detalles del Perfil */}
        <Grid item xs={12} md={8}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                🏢 Información de la Empresa
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    p: 2.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                    }
                  }}>
                    <BusinessIcon sx={{ 
                      mr: 2, 
                      color: 'primary.main',
                      fontSize: '2rem',
                      p: 1,
                      borderRadius: 2,
                      background: 'rgba(99, 102, 241, 0.1)'
                    }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                        🏢 Empresa
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {profile.companyName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    p: 2.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(52, 211, 153, 0.08) 100%)',
                    }
                  }}>
                    <LocationIcon sx={{ 
                      mr: 2, 
                      color: 'success.main',
                      fontSize: '2rem',
                      p: 1,
                      borderRadius: 2,
                      background: 'rgba(16, 185, 129, 0.1)'
                    }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                        📍 Ubicación
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {profile.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {isPyME && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        p: 2.5,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(245, 158, 11, 0.15)',
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.08) 100%)',
                        }
                      }}>
                        <BusinessIcon sx={{ 
                          mr: 2, 
                          color: 'warning.main',
                          fontSize: '2rem',
                          p: 1,
                          borderRadius: 2,
                          background: 'rgba(245, 158, 11, 0.1)'
                        }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            🏭 Industria
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                            {profile.industry}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        p: 2.5,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                        }
                      }}>
                        <BusinessIcon sx={{ 
                          mr: 2, 
                          color: 'secondary.main',
                          fontSize: '2rem',
                          p: 1,
                          borderRadius: 2,
                          background: 'rgba(139, 92, 246, 0.1)'
                        }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            📏 Tamaño
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                            {profile.size}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ 
                        mb: 3,
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        <Typography 
                          variant="h6" 
                          color="text.secondary" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 600, 
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          🎯 Tipos de servicios que necesitas
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {profile.serviceTypes?.map((serviceType, index) => (
                            <Chip
                              key={index}
                              label={serviceType}
                              size="medium"
                              variant="outlined"
                              color="info"
                              sx={{
                                borderRadius: 3,
                                fontWeight: 600,
                                px: 2,
                                py: 1,
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '2px solid rgba(59, 130, 246, 0.3)',
                                '&:hover': {
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  transform: 'scale(1.05)',
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}

                {isProveedor && (
                  <>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Servicios Ofrecidos
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profile.services?.map((service, index) => (
                            <Chip
                              key={index}
                              label={service}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Capacidades
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profile.capabilities?.map((capability, index) => (
                            <Chip
                              key={index}
                              label={capability}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>

              <Divider sx={{ 
                my: 4, 
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 2,
                borderRadius: 2
              }} />

              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                📞 Información de Contacto
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    p: 2.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(74, 222, 128, 0.05) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(34, 197, 94, 0.15)',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(74, 222, 128, 0.08) 100%)',
                    }
                  }}>
                    <PhoneIcon sx={{ 
                      mr: 2, 
                      color: 'success.main',
                      fontSize: '2rem',
                      p: 1,
                      borderRadius: 2,
                      background: 'rgba(34, 197, 94, 0.1)'
                    }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                        📱 Teléfono
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {profile.contactInfo?.phone || 'No especificado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    p: 2.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(196, 181, 253, 0.05) 100%)',
                    border: '1px solid rgba(168, 85, 247, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(168, 85, 247, 0.15)',
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(196, 181, 253, 0.08) 100%)',
                    }
                  }}>
                    <LocationIcon sx={{ 
                      mr: 2, 
                      color: 'secondary.main',
                      fontSize: '2rem',
                      p: 1,
                      borderRadius: 2,
                      background: 'rgba(168, 85, 247, 0.1)'
                    }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                        🏠 Dirección
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                        {profile.contactInfo?.address || 'No especificado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {isProveedor && profile.pricing && profile.pricing.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Información de Precios
                  </Typography>
                  <Grid container spacing={2}>
                    {profile.pricing.map((price, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="body2" color="text.secondary">
                            {price.service}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${price.minPrice} - ${price.maxPrice} {price.unit}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
