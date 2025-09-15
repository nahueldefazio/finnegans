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
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { Product, ProveedorProfile } from '../../types/index';

interface ProductCardProps {
  product: Product;
  proveedor: ProveedorProfile;
  onContact: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, proveedor, onContact }) => {
  const formatPrice = () => {
    return `${product.pricing.currency} ${product.pricing.price} ${product.pricing.unit}`;
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
          border: '1px solid rgba(139, 92, 246, 0.3)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            <InventoryIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Ofrecido por: <strong>{proveedor.companyName}</strong>
            </Typography>
            <Chip
              label={product.category}
              size="small"
              color="secondary"
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
          {product.description}
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
          {product.availability.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {product.availability.location}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ShippingIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              Stock: {product.availability.stock} unidades
            </Typography>
          </Box>
        </Box>

        {/* Especificaciones */}
        {product.specifications.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Especificaciones:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {product.specifications.slice(0, 3).map((spec, index) => (
                <Chip
                  key={index}
                  label={spec}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {product.specifications.length > 3 && (
                <Chip
                  label={`+${product.specifications.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Características */}
        {product.features.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Características:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {product.features.slice(0, 3).map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {product.features.length > 3 && (
                <Chip
                  label={`+${product.features.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Etiquetas */}
        {product.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {product.tags.slice(0, 4).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
              {product.tags.length > 4 && (
                <Chip
                  label={`+${product.tags.length - 4}`}
                  size="small"
                  color="primary"
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
            label={product.status === 'active' ? 'Disponible' : 'No disponible'}
            color={product.status === 'active' ? 'success' : 'default'}
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
          onClick={() => onContact(product.id)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
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

export default ProductCard;
