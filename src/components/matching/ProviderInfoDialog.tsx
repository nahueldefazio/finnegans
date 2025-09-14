import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Rating,
} from '@mui/material';
import { Close as CloseIcon, LocationOn, Phone, Business } from '@mui/icons-material';
import { ProveedorProfile } from '../../types';

interface ProviderInfoDialogProps {
  open: boolean;
  onClose: () => void;
  provider: ProveedorProfile | null;
}

const ProviderInfoDialog: React.FC<ProviderInfoDialogProps> = ({ open, onClose, provider }) => {
  if (!provider) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 4,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              {provider.companyName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                {provider.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {provider.location}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Información General */}
          <Grid xs={12} md={8}>
            <Card sx={{ mb: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="primary" />
                  Información de la Empresa
                </Typography>
                <Typography variant="body1" paragraph>
                  {provider.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Servicios disponibles:
                  </Typography>
                  <Typography variant="body1">
                    {provider.services.length} servicios especializados
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Calificación:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={provider.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2">
                      {provider.rating} ({provider.totalReviews} reseñas)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Servicios */}
            <Card sx={{ mb: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Servicios Ofrecidos
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {provider.services.map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      color="secondary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Precios Orientativos */}
            {provider.pricing && provider.pricing.length > 0 && (
              <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Precios Orientativos
                  </Typography>
                  {provider.pricing.map((price, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {price.service}
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        ${price.minPrice.toLocaleString()} - ${price.maxPrice.toLocaleString()} {price.unit}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Información de Contacto */}
          <Grid xs={12} md={4}>
            <Card sx={{ boxShadow: 2, position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de Contacto
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn color="primary" fontSize="small" />
                    <Typography variant="subtitle2">Ubicación</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 4 }}>
                    {provider.location}
                  </Typography>
                </Box>

                {provider.contactInfo?.phone && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Phone color="primary" fontSize="small" />
                      <Typography variant="subtitle2">Teléfono</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 4 }}>
                      {provider.contactInfo.phone}
                    </Typography>
                  </Box>
                )}

                {provider.contactInfo?.address && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn color="primary" fontSize="small" />
                      <Typography variant="subtitle2">Dirección</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 4 }}>
                      {provider.contactInfo.address}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Calificación Promedio
                  </Typography>
                  <Rating
                    value={4.5}
                    precision={0.1}
                    readOnly
                    size="large"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Basado en 24 reseñas
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button variant="contained" color="primary">
          Contactar Proveedor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProviderInfoDialog;
