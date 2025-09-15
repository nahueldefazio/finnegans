import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { PyMEProfile, ProveedorProfile } from '../types';
import { pymeProfilePersistenceService, proveedorProfilePersistenceService } from '../services/dataPersistenceService';
import { SERVICE_TYPES } from '../constants/serviceTypes';

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PyMEProfile | ProveedorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!profile || !user?.id) return;

    setSaving(true);
    setError(null);

    try {
      // Determinar si es PyME o Proveedor y guardar usando el servicio correcto
      if ('industry' in profile) {
        // Es un perfil PyME
        pymeProfilePersistenceService.saveProfile(profile as PyMEProfile);
      } else if ('services' in profile) {
        // Es un perfil Proveedor
        proveedorProfilePersistenceService.saveProfile(profile as ProveedorProfile);
      }
      
      setSuccess(true);
      
      // Redirigir al perfil después de un breve delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!profile) return;

    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const handleBudgetChange = (field: 'min' | 'max', value: number) => {
    if (!profile || !isPyME) return;

    setProfile({
      ...profile,
      budget: {
        ...profile.budget,
        [field]: value,
      },
    });
  };

  const handleContactInfoChange = (field: string, value: string) => {
    if (!profile) return;

    setProfile({
      ...profile,
      contactInfo: {
        ...profile.contactInfo,
        [field]: value,
      },
    });
  };

  // Función para manejar cambios de precios (no utilizada actualmente)
  // const handlePricingChange = (field: string, value: number) => {
  //   if (!profile || !('pricing' in profile)) return;
  //   setProfile({
  //     ...profile,
  //     pricing: {
  //       ...profile.pricing,
  //       [field]: value,
  //     },
  //   });
  // };

  const isPyME = profile && 'companyName' in profile && 'industry' in profile;
  const isProveedor = profile && 'companyName' in profile && 'services' in profile;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
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
        >
          Crear Perfil
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/profile')}
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            Editar Perfil
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Perfil guardado exitosamente. Redirigiendo...
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Información Básica
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de la Empresa"
                value={profile.companyName || ''}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ubicación"
                value={profile.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={profile.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>

            {isPyME && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Industria</InputLabel>
                    <Select
                      value={profile.industry || ''}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      label="Industria"
                    >
                      <MenuItem value="tecnologia">Tecnología</MenuItem>
                      <MenuItem value="manufactura">Manufactura</MenuItem>
                      <MenuItem value="servicios">Servicios</MenuItem>
                      <MenuItem value="retail">Retail</MenuItem>
                      <MenuItem value="salud">Salud</MenuItem>
                      <MenuItem value="educacion">Educación</MenuItem>
                      <MenuItem value="finanzas">Finanzas</MenuItem>
                      <MenuItem value="otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tamaño de la Empresa</InputLabel>
                    <Select
                      value={profile.size || ''}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      label="Tamaño de la Empresa"
                    >
                      <MenuItem value="micro">Micro (1-10 empleados)</MenuItem>
                      <MenuItem value="pequena">Pequeña (11-50 empleados)</MenuItem>
                      <MenuItem value="mediana">Mediana (51-250 empleados)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={SERVICE_TYPES}
                    value={profile.serviceTypes || []}
                    onChange={(_, newValue) => handleInputChange('serviceTypes', newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...otherProps } = getTagProps({ index });
                        return (
                          <Chip key={key} variant="outlined" label={option} {...otherProps} />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipos de servicios que necesitas"
                        placeholder="Selecciona los tipos de servicios que tu empresa necesita"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                    Presupuesto
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Presupuesto Mínimo (MXN)"
                    type="number"
                    value={profile.budget?.min || ''}
                    onChange={(e) => handleBudgetChange('min', parseInt(e.target.value) || 0)}
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Presupuesto Máximo (MXN)"
                    type="number"
                    value={profile.budget?.max || ''}
                    onChange={(e) => handleBudgetChange('max', parseInt(e.target.value) || 0)}
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </>
            )}

            {isProveedor && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Capacidades"
                    value={profile.capabilities?.join(', ') || ''}
                    onChange={(e) => handleInputChange('capabilities', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    variant="outlined"
                    placeholder="Separar con comas"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={profile.services || []}
                    onChange={(_, newValue) => handleInputChange('services', newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...otherProps } = getTagProps({ index });
                        return (
                          <Chip key={key} variant="outlined" label={option} {...otherProps} />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Servicios Ofrecidos"
                        placeholder="Agregar servicio..."
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
            Información de Contacto
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={profile.contactInfo?.phone || ''}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                value={profile.contactInfo?.address || ''}
                onChange={(e) => handleContactInfoChange('address', e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>

          {isProveedor && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
                Información de Precios
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Los precios se configuran por servicio individual. Puedes agregar múltiples servicios con sus respectivos precios.
                  </Typography>
                  <Button variant="outlined" size="small">
                    Agregar Servicio con Precio
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditProfilePage;
