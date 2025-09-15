import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  Grid,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { SmartMatchResult } from '../../services/smartMatchingService';

interface SmartMatchCardProps {
  match: SmartMatchResult;
  onContact: (proveedorId: string) => void;
}

const SmartMatchCard: React.FC<SmartMatchCardProps> = ({ match, onContact }) => {
  const { service, proveedor, matchScore, reasons, compatibility } = match;

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#4caf50'; // Verde
    if (score >= 0.6) return '#ff9800'; // Naranja
    return '#f44336'; // Rojo
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excelente';
    if (score >= 0.6) return 'Bueno';
    return 'Regular';
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${getScoreColor(matchScore)}20`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header con score de matching */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {service.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {service.description}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right', ml: 2 }}>
            <Chip
              label={`${(matchScore * 100).toFixed(0)}% Match`}
              sx={{
                backgroundColor: getScoreColor(matchScore),
                color: 'white',
                fontWeight: 600,
                mb: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {getScoreLabel(matchScore)}
            </Typography>
          </Box>
        </Box>

        {/* Información del proveedor */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {proveedor.companyName}
          </Typography>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Rating value={proveedor.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({proveedor.totalReviews} reseñas)
            </Typography>
          </Box>
        </Box>

        {/* Ubicación */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {service.availability.location}
          </Typography>
        </Box>

        {/* Precio */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {service.pricing.minPrice === service.pricing.maxPrice
              ? `$${service.pricing.minPrice} ${service.pricing.unit}`
              : `$${service.pricing.minPrice} - $${service.pricing.maxPrice} ${service.pricing.unit}`
            }
          </Typography>
        </Box>

        {/* Razones de matching */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            ¿Por qué es perfecto para ti?
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {reasons.map((reason, index) => (
              <Chip
                key={index}
                icon={<CheckIcon />}
                label={reason}
                size="small"
                color="success"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        {/* Detalles de compatibilidad */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Compatibilidad detallada
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Necesidades
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={compatibility.needs * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getScoreColor(compatibility.needs),
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: getScoreColor(compatibility.needs) }}>
                  {(compatibility.needs * 100).toFixed(0)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Presupuesto
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={compatibility.budget * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getScoreColor(compatibility.budget),
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: getScoreColor(compatibility.budget) }}>
                  {(compatibility.budget * 100).toFixed(0)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Ubicación
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={compatibility.location * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getScoreColor(compatibility.location),
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: getScoreColor(compatibility.location) }}>
                  {(compatibility.location * 100).toFixed(0)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Industria
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={compatibility.industry * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getScoreColor(compatibility.industry),
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: getScoreColor(compatibility.industry) }}>
                  {(compatibility.industry * 100).toFixed(0)}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Botón de contacto */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => onContact(proveedor.userId)}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5b5bd6 0%, #7c3aed 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
              },
            }}
          >
            Contactar Proveedor
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SmartMatchCard;
