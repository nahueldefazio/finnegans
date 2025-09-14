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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProveedorProfile } from '../../types';
import { proveedorProfilePersistenceService } from '../../services/dataPersistenceService';
import { SERVICE_TYPES } from '../../constants/serviceTypes';

const ProveedorProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ProveedorProfile>>({
    companyName: '',
    services: [],
    capabilities: [],
    pricing: [],
    location: '',
    description: '',
    contactInfo: { phone: '', address: '' },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPricing, setNewPricing] = useState({
    service: '',
    minPrice: 0,
    maxPrice: 0,
    unit: 'por hora',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadExistingProfile = useCallback(() => {
    if (!user?.id) return;
    
    try {
      const existingProfile = proveedorProfilePersistenceService.getProfileByUserId(user.id);
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

  // Usar los tipos de servicios centralizados
  const commonServices = [...SERVICE_TYPES];

  const commonCapabilities = [
    'Trabajo remoto',
    'Presencial',
    '24/7 disponible',
    'Certificaciones',
    'Experiencia internacional',
    'Soporte técnico',
    'Garantía',
    'Escalabilidad',
    'Integración de sistemas',
    'Consultoría especializada',
  ];

  const pricingUnits = [
    'por hora',
    'por proyecto',
    'por mes',
    'por año',
    'por unidad',
  ];

  const handleChange = (field: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
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

  const handleAddPricing = () => {
    if (newPricing.service && newPricing.minPrice && newPricing.maxPrice) {
      setFormData(prev => ({
        ...prev,
        pricing: [...(prev.pricing || []), { ...newPricing }],
      }));
      setNewPricing({
        service: '',
        minPrice: 0,
        maxPrice: 0,
        unit: 'por hora',
      });
    }
  };

  const handleRemovePricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simular guardado del perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profile: ProveedorProfile = {
        id: isEditing ? formData.id || Date.now().toString() : Date.now().toString(),
        userId: user?.id || '',
        rating: 0,
        totalReviews: 0,
        ...formData,
      } as ProveedorProfile;

      // Guardar usando el servicio de persistencia
      proveedorProfilePersistenceService.saveProfile(profile);
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
          {isEditing ? 'Editar Perfil de Proveedor' : 'Perfil de Proveedor'}
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          {isEditing 
            ? 'Actualiza la información de tu perfil' 
            : 'Completa tu perfil para conectar con PyMEs que necesitan tus servicios'
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
                  options={commonServices}
                  value={formData.services || []}
                  onChange={(_, newValue) => {
                    setFormData(prev => ({ ...prev, services: newValue }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Servicios ofrecidos"
                      placeholder="Selecciona los servicios que ofreces"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12}>
                <Autocomplete
                  multiple
                  options={commonCapabilities}
                  value={formData.capabilities || []}
                  onChange={(_, newValue) => {
                    setFormData(prev => ({ ...prev, capabilities: newValue }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Capacidades y características"
                      placeholder="Selecciona tus capacidades"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Precios Orientativos
                </Typography>
              </Grid>

              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Servicio"
                  value={newPricing.service}
                  onChange={(e) => setNewPricing(prev => ({ ...prev, service: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Precio min"
                  type="number"
                  value={newPricing.minPrice}
                  onChange={(e) => setNewPricing(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Precio max"
                  type="number"
                  value={newPricing.maxPrice}
                  onChange={(e) => setNewPricing(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid xs={12} md={2}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    value={newPricing.unit}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, unit: e.target.value }))}
                    label="Unidad"
                  >
                    {pricingUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={12} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', mb: 2 }}>
                  <IconButton onClick={handleAddPricing} color="primary">
                    <AddIcon />
                  </IconButton>
                </Box>
              </Grid>

              <Grid xs={12}>
                <List sx={{ mb: 2 }}>
                  {formData.pricing?.map((price, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={`${price.service}`}
                        secondary={`$${price.minPrice} - $${price.maxPrice} ${price.unit}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => handleRemovePricing(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
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

export default ProveedorProfileForm;
