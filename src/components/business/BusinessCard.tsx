import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  LinearProgress,
} from '@mui/material';
import { Business, Review } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface BusinessCardProps {
  business: Business;
  onUpdateStatus: (businessId: string, status: Business['status']) => void;
  onReview: (businessId: string) => void;
  reviews?: Review[];
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onUpdateStatus,
  onReview,
  reviews = [],
}) => {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Business['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: Business['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getProgressValue = (status: Business['status']) => {
    switch (status) {
      case 'pending': return 25;
      case 'in_progress': return 75;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const canUpdateStatus = (status: Business['status']) => {
    return status === 'pending' || status === 'in_progress';
  };

  const canReview = (status: Business['status']) => {
    return status === 'completed' && !reviews.some(r => r.fromUserId === user?.id);
  };

  const getNextStatus = (currentStatus: Business['status']) => {
    switch (currentStatus) {
      case 'pending': return 'in_progress';
      case 'in_progress': return 'completed';
      default: return currentStatus;
    }
  };

  const getNextStatusText = (currentStatus: Business['status']) => {
    switch (currentStatus) {
      case 'pending': return 'Iniciar Proyecto';
      case 'in_progress': return 'Marcar como Completado';
      default: return '';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: business.status === 'completed' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' :
                     business.status === 'in_progress' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' :
                     business.status === 'pending' ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' :
                     'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, overflow: 'hidden' }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid xs={12} md={8} sx={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography 
                variant="h6"
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Proyecto #{business.id.slice(-6)}
              </Typography>
              <Chip
                label={getStatusText(business.status)}
                color={getStatusColor(business.status)}
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <LinearProgress
                variant="determinate"
                value={getProgressValue(business.status)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ mb: 2, p: 1.5, pl: 2, minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    Monto Total
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 600, 
                      wordBreak: 'break-word',
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    ${business.totalAmount} {business.currency}
                  </Typography>
                </Box>
              </Grid>

              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ mb: 2, p: 1.5, minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    Fecha de Inicio
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formatDate(business.startDate)}
                  </Typography>
                </Box>
              </Grid>

              {business.endDate && (
                <Grid xs={12} sm={6} md={3}>
                  <Box sx={{ mb: 2, p: 1.5, minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Fecha de Finalización
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {formatDate(business.endDate)}
                    </Typography>
                  </Box>
                </Grid>
              )}

              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ mb: 2, p: 1.5, minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    Duración
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {business.endDate 
                      ? `${Math.ceil((new Date(business.endDate).getTime() - new Date(business.startDate).getTime()) / (1000 * 60 * 60 * 24))} días`
                      : `${Math.ceil((Date.now() - new Date(business.startDate).getTime()) / (1000 * 60 * 60 * 24))} días`
                    }
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={12} md={4} sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
              {canUpdateStatus(business.status) && (
                <Button
                  variant="contained"
                  onClick={() => onUpdateStatus(business.id, getNextStatus(business.status))}
                  fullWidth
                >
                  {getNextStatusText(business.status)}
                </Button>
              )}

              {canReview(business.status) && (
                <Button
                  variant="outlined"
                  onClick={() => onReview(business.id)}
                  fullWidth
                >
                  Escribir Reseña
                </Button>
              )}

              {business.status === 'completed' && reviews.some(r => r.fromUserId === user?.id) && (
                <Button
                  variant="text"
                  disabled
                  fullWidth
                >
                  Reseña Enviada
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
