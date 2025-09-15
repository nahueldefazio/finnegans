import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { SERVICE_TYPES } from '../constants/serviceTypes';
import { createService, createProduct } from '../services/serviceService';

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  type: 'service' | 'product';
  pricing: {
    minPrice: number;
    maxPrice: number;
    currency: string;
    unit: string;
  };
  availability: {
    isAvailable: boolean;
    location: string;
  };
  features: string[];
  requirements: string[];
  tags: string[];
}

const SimpleAddServicePage: React.FC = () => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: '',
    type: 'service',
    pricing: {
      minPrice: 0,
      maxPrice: 0,
      currency: 'USD',
      unit: 'por hora',
    },
    availability: {
      isAvailable: true,
      location: '',
    },
    features: [],
    requirements: [],
    tags: [],
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: keyof ServiceFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push('El nombre es requerido');
    if (!formData.description.trim()) errors.push('La descripción es requerida');
    if (!formData.category) errors.push('La categoría es requerida');
    if (formData.pricing.minPrice <= 0) errors.push('El precio mínimo debe ser mayor a 0');
    if (formData.pricing.maxPrice <= 0) errors.push('El precio máximo debe ser mayor a 0');
    if (formData.pricing.minPrice > formData.pricing.maxPrice) errors.push('El precio mínimo no puede ser mayor al máximo');
    if (!formData.availability.location.trim()) errors.push('La ubicación es requerida');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Usar un ID fijo para el "proveedor" del sistema
      const systemUserId = 'system_provider';
      
      if (formData.type === 'service') {
        await createService(systemUserId, {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          type: 'service',
          pricing: {
            minPrice: formData.pricing.minPrice,
            maxPrice: formData.pricing.maxPrice,
            currency: formData.pricing.currency,
            unit: formData.pricing.unit,
          },
          availability: {
            isAvailable: formData.availability.isAvailable,
            location: formData.availability.location,
          },
          features: formData.features,
          requirements: formData.requirements,
          deliveryTime: '1-3 días',
          images: [],
          tags: formData.tags,
          status: 'active',
        });
      } else {
        await createProduct(systemUserId, {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          type: 'product',
          pricing: {
            price: formData.pricing.minPrice,
            currency: formData.pricing.currency,
            unit: formData.pricing.unit,
          },
          availability: {
            isAvailable: formData.availability.isAvailable,
            stock: 10,
            location: formData.availability.location,
          },
          specifications: formData.requirements,
          features: formData.features,
          images: [],
          tags: formData.tags,
          status: 'active',
        });
      }

      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        category: '',
        type: 'service',
        pricing: {
          minPrice: 0,
          maxPrice: 0,
          currency: 'USD',
          unit: 'por hora',
        },
        availability: {
          isAvailable: true,
          location: '',
        },
        features: [],
        requirements: [],
        tags: [],
      });
      setCurrentFeature('');
      setCurrentRequirement('');
      setCurrentTag('');

    } catch (err) {
      setError('Error al crear el servicio/producto. Inténtalo de nuevo.');
      console.error('Error creating service/product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: 3,
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
      minHeight: '100vh',
    }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        ➕ Agregar Servicio/Producto
      </Typography>

      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
      }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Tipo */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={formData.type}
                    label="Tipo"
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <MenuItem value="service">Servicio</MenuItem>
                    <MenuItem value="product">Producto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Nombre */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>

              {/* Descripción */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </Grid>

              {/* Categoría */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.category}
                    label="Categoría"
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    {SERVICE_TYPES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Precios */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio Mínimo (USD)"
                  value={formData.pricing.minPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      handleNestedInputChange('pricing', 'minPrice', value === '' ? 0 : Number(value));
                    }
                  }}
                  inputProps={{ 
                    min: 0,
                    pattern: '[0-9]*',
                    inputMode: 'numeric'
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio Máximo (USD)"
                  value={formData.pricing.maxPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      handleNestedInputChange('pricing', 'maxPrice', value === '' ? 0 : Number(value));
                    }
                  }}
                  inputProps={{ 
                    min: 0,
                    pattern: '[0-9]*',
                    inputMode: 'numeric'
                  }}
                  required
                />
              </Grid>

              {/* Ubicación */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  value={formData.availability.location}
                  onChange={(e) => handleNestedInputChange('availability', 'location', e.target.value)}
                  required
                />
              </Grid>

              {/* Características */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Características</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Agregar característica"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button onClick={addFeature} variant="outlined">
                    <AddIcon />
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => removeFeature(index)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Requisitos */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Requisitos</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Agregar requisito"
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button onClick={addRequirement} variant="outlined">
                    <AddIcon />
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.requirements.map((requirement, index) => (
                    <Chip
                      key={index}
                      label={requirement}
                      onDelete={() => removeRequirement(index)}
                      color="secondary"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Etiquetas</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Agregar etiqueta"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} variant="outlined">
                    <AddIcon />
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(index)}
                      color="default"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Botón de envío */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <AddIcon /> : <SaveIcon />}
                    sx={{
                      minWidth: 200,
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b5bd6 0%, #7c3aed 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                      },
                    }}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Snackbars para notificaciones */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          ¡Servicio/Producto creado exitosamente! Ya aparece en la búsqueda.
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SimpleAddServicePage;
