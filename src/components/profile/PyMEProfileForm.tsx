import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Grid,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PyMEProfile } from '../../types';
import { pymeProfilePersistenceService } from '../../services/dataPersistenceService';
import { SERVICE_TYPES } from '../../constants/serviceTypes';

const PyMEProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<PyMEProfile>>({
    companyName: '',
    industry: '',
    size: 'micro',
    location: '',
    needs: [],
    serviceTypes: [],
    budget: { min: 0, max: 0 },
    description: '',
    contactInfo: { phone: '', address: '' },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadExistingProfile = useCallback(() => {
    if (!user?.id) return;
    
    try {
      const existingProfile = pymeProfilePersistenceService.getProfileByUserId(user.id);
      if (existingProfile) {
        setFormData(existingProfile);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading existing profile:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadExistingProfile();
  }, [loadExistingProfile]);

  const industries = [
    'Tecnología',
    'Manufactura',
    'Servicios',
    'Retail',
    'Construcción',
    'Salud',
    'Educación',
    'Finanzas',
    'Agricultura',
    'Turismo',
  ];

  const commonNeeds = [
    'Desarrollo de software',
    'Marketing digital',
    'Contabilidad',
    'Recursos humanos',
    'Logística',
    'Diseño gráfico',
    'Consultoría',
    'Mantenimiento',
    'Seguridad',
    'Capacitación',
  ];

  const handleChange = (field: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleBudgetChange = (field: 'min' | 'max') => (e: any) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget!,
        [field]: Number(e.target.value),
      },
    }));
  };

  const handleContactChange = (field: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo!,
        [field]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simular guardado del perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profile: PyMEProfile = {
        id: isEditing ? formData.id || Date.now().toString() : Date.now().toString(),
        userId: user?.id || '',
        ...formData,
      } as PyMEProfile;

      // Guardar usando el servicio de persistencia
      pymeProfilePersistenceService.saveProfile(profile);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
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
          {isEditing ? 'Editar Perfil de PyME' : 'Perfil de PyME'}
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          {isEditing 
            ? 'Actualiza la información de tu perfil' 
            : 'Completa tu perfil para encontrar los mejores proveedores'
          }
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de la empresa"
                  value={formData.companyName}
                  onChange={handleChange('companyName')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel>Industria</InputLabel>
                  <Select
                    value={formData.industry}
                    onChange={handleChange('industry')}
                    label="Industria"
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={12} md={6}>
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel>Tamaño de empresa</InputLabel>
                  <Select
                    value={formData.size}
                    onChange={handleChange('size')}
                    label="Tamaño de empresa"
                  >
                    <MenuItem value="micro">Micro (1-10 empleados)</MenuItem>
                    <MenuItem value="pequeña">Pequeña (11-50 empleados)</MenuItem>
                    <MenuItem value="mediana">Mediana (51-250 empleados)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  value={formData.location}
                  onChange={handleChange('location')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12}>
                <Autocomplete
                  multiple
                  options={commonNeeds}
                  value={formData.needs || []}
                  onChange={(_, newValue) => {
                    setFormData(prev => ({ ...prev, needs: newValue }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Necesidades de servicios"
                      placeholder="Selecciona las necesidades de tu empresa"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12}>
                <Autocomplete
                  multiple
                  options={SERVICE_TYPES}
                  value={formData.serviceTypes || []}
                  onChange={(_, newValue) => {
                    setFormData(prev => ({ ...prev, serviceTypes: newValue }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipos de servicios que necesitas"
                      placeholder="Selecciona los tipos de servicios que tu empresa necesita"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Presupuesto mínimo (USD)"
                  type="number"
                  value={formData.budget?.min || ''}
                  onChange={handleBudgetChange('min')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Presupuesto máximo (USD)"
                  type="number"
                  value={formData.budget?.max || ''}
                  onChange={handleBudgetChange('max')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Descripción de la empresa"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange('description')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono de contacto"
                  value={formData.contactInfo?.phone || ''}
                  onChange={handleContactChange('phone')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.contactInfo?.address || ''}
                  onChange={handleContactChange('address')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              justifyContent: 'center',
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  minWidth: 220,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {loading ? <CircularProgress size={24} /> : (isEditing ? 'Actualizar Perfil' : 'Guardar Perfil')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PyMEProfileForm;
