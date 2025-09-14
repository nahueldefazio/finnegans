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
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Mi Perfil
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditProfile}
        >
          Editar Perfil
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Información Principal */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {profile.companyName?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.companyName}
              </Typography>
              <Chip
                label={isPyME ? 'PyME' : 'Proveedor'}
                color={isPyME ? 'primary' : 'secondary'}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {profile.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Detalles del Perfil */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Información de la Empresa
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Empresa
                      </Typography>
                      <Typography variant="body1">
                        {profile.companyName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ubicación
                      </Typography>
                      <Typography variant="body1">
                        {profile.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {isPyME && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Industria
                          </Typography>
                          <Typography variant="body1">
                            {profile.industry}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Tamaño
                          </Typography>
                          <Typography variant="body1">
                            {profile.size}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Tipos de servicios que necesitas
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profile.serviceTypes?.map((serviceType, index) => (
                            <Chip
                              key={index}
                              label={serviceType}
                              size="small"
                              variant="outlined"
                              color="primary"
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

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Información de Contacto
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body1">
                        {profile.contactInfo?.phone || 'No especificado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Dirección
                      </Typography>
                      <Typography variant="body1">
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
