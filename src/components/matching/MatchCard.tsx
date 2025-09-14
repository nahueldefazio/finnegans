import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import { Business as BusinessIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { Match, ProveedorProfile } from '../../types';
import ProviderInfoDialog from './ProviderInfoDialog';

interface MatchCardProps {
  match: Match;
  proveedor: ProveedorProfile;
  onContact: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, proveedor, onContact }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const handleViewProfile = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Card 
        sx={{ 
          mb: 2, 
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: match.score >= 80 ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' :
                       match.score >= 60 ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' :
                       'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
          }
        }}
      >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar 
                sx={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  mr: 2,
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {proveedor.companyName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {proveedor.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
              {proveedor.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Servicios:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {proveedor.services.slice(0, 4).map((service) => (
                  <Chip
                    key={service}
                    label={service}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
                {proveedor.services.length > 4 && (
                  <Chip
                    label={`+${proveedor.services.length - 4} más`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Por qué es una buena coincidencia:
              </Typography>
              <Box>
                {match.reasons.map((reason, index) => (
                  <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    • {reason}
                  </Typography>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={proveedor.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {proveedor.rating} ({proveedor.totalReviews} reseñas)
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color={`${getScoreColor(match.score)}.main`} gutterBottom>
                {match.score}%
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Coincidencia
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Precios orientativos:
                </Typography>
                {proveedor.pricing.slice(0, 2).map((price, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    {price.service}: ${price.minPrice}-${price.maxPrice} {price.unit}
                  </Typography>
                ))}
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={() => onContact(match.id)}
                sx={{ mb: 1 }}
              >
                Iniciar Conversación
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={handleViewProfile}
              >
                Ver Perfil
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

      <ProviderInfoDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        provider={proveedor}
      />
    </>
  );
};

export default MatchCard;
