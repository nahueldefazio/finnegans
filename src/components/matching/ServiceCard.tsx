import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { Service, ProveedorProfile } from '../../types/index';

interface ServiceCardProps {
  service: Service;
  proveedor: ProveedorProfile;
  onContact: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, proveedor, onContact }) => {
  const formatPrice = () => {
    return `${service.pricing.currency} ${service.pricing.minPrice} - ${service.pricing.maxPrice} ${service.pricing.unit}`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            <BusinessIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {service.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Ofrecido por: <strong>{proveedor.companyName}</strong>
            </Typography>
            <Chip
              label={service.category}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Box>

        {/* Descripción */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {service.description}
        </Typography>

        {/* Precio */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MoneyIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
          <Typography variant="h6" color="success.main" fontWeight="bold">
            {formatPrice()}
          </Typography>
        </Box>

        {/* Información adicional */}
        <Box sx={{ mb: 2 }}>
          {service.availability.schedule && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {service.availability.schedule}
              </Typography>
            </Box>
          )}
          
          {service.availability.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {service.availability.location}
              </Typography>
            </Box>
          )}

          {service.deliveryTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                Entrega: {service.deliveryTime}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Características */}
        {service.features.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Características:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {service.features.slice(0, 3).map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {service.features.length > 3 && (
                <Chip
                  label={`+${service.features.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Etiquetas */}
        {service.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {service.tags.slice(0, 4).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
              {service.tags.length > 4 && (
                <Chip
                  label={`+${service.tags.length - 4}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Estado */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Chip
            label={service.status === 'active' ? 'Disponible' : 'No disponible'}
            color={service.status === 'active' ? 'success' : 'default'}
            size="small"
            variant="filled"
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon sx={{ mr: 0.5, color: 'warning.main', fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {proveedor.rating}/5 ({proveedor.totalReviews} reseñas)
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 2, pt: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onContact(service.id)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Contactar Proveedor
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
