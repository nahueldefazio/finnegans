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
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { Business, Review } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { getChatStatusForBusiness } from '../../services/businessService';
import { dataPersistenceService } from '../../services/dataPersistenceService';

interface BusinessCardProps {
  business: Business;
  onReview: (businessId: string) => void;
  reviews?: Review[];
  loading?: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onReview,
  reviews = [],
  loading = false,
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
      case 'pending': return 'info';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: Business['status']) => {
    switch (status) {
      case 'pending': return 'En Proceso';
      case 'in_progress': return 'En Proceso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getProgressValue = (status: Business['status']) => {
    switch (status) {
      case 'pending': return 50;
      case 'in_progress': return 50;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const canReview = (status: Business['status']) => {
    return status === 'completed' && !reviews.some(r => r.fromUserId === user?.id);
  };

  const getChatStatus = () => {
    return getChatStatusForBusiness(business.id);
  };

  const getChatStatusColor = (chatStatus: 'active' | 'closed' | 'no_chat') => {
    switch (chatStatus) {
      case 'active': return 'info';
      case 'closed': return 'success';
      case 'no_chat': return 'default';
      default: return 'default';
    }
  };

  const getChatStatusText = (chatStatus: 'active' | 'closed' | 'no_chat') => {
    switch (chatStatus) {
      case 'active': return 'Chat Activo';
      case 'closed': return 'Chat Cerrado';
      case 'no_chat': return 'Sin Chat';
      default: return 'Sin Chat';
    }
  };

  const getBusinessTitle = () => {
    try {
      // Obtener información de la PyME y el proveedor
      const pymeProfile = dataPersistenceService.pymeProfiles.getProfileByUserId(business.pymeId);
      const proveedorProfile = dataPersistenceService.proveedorProfiles.getProfileByUserId(business.proveedorId);
      
      const pymeName = pymeProfile?.companyName || 'PyME';
      const proveedorName = proveedorProfile?.companyName || 'Proveedor';
      
      // Crear un título más descriptivo
      return `${pymeName} ↔ ${proveedorName}`;
    } catch (error) {
      // Fallback al ID si hay algún error
      return `Proyecto #${business.id.slice(-6)}`;
    }
  };

  if (loading) {
    return (
      <Card 
        sx={{ 
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4 }}>
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="rounded" width={100} height={24} />
            <Skeleton variant="rounded" width={120} height={24} />
          </Box>
          <Skeleton variant="rounded" width="100%" height={10} sx={{ mb: 5 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid xs={12} sm={6} md={3} key={item}>
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1.5 }} />
                  <Skeleton variant="text" width="80%" height={24} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
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
          animation: 'shimmer 2s infinite',
        },
        '@keyframes shimmer': {
          '0%': { opacity: 0.8 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.8 },
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4.5 }, overflow: 'hidden' }}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid xs={12} md={8} sx={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4, flexWrap: 'wrap' }}>
              <Typography 
                variant="h6"
                sx={{
                  marginLeft: '20px',
                  marginTop: '10px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {getBusinessTitle()}
              </Typography>
              <Chip
                label={getStatusText(business.status)}
                color={getStatusColor(business.status)}
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  }
                }}
              />
              <Chip
                label={getChatStatusText(getChatStatus())}
                color={getChatStatusColor(getChatStatus())}
                size="small"
                variant="outlined"
                sx={{ 
                  fontWeight: 500,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 5 }}>
              <LinearProgress
                variant="determinate"
                value={getProgressValue(business.status)}
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: business.status === 'completed' ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' :
                               business.status === 'in_progress' ? 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)' :
                               business.status === 'pending' ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' :
                               'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                    animation: 'progressGlow 2s ease-in-out infinite alternate',
                  },
                  '@keyframes progressGlow': {
                    '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.3)' },
                    '100%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.6)' },
                  }
                }}
              />
            </Box>

            <Grid container spacing={3} sx={{ maxWidth: '100%', justifyContent: 'center' }}>
              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ 
                  mb: 2.5, 
                  p: 3, 
                  minWidth: 0, 
                  maxWidth: '100%', 
                  overflow: 'hidden',
                  textAlign: 'center',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
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
                <Box sx={{ 
                  mb: 2.5, 
                  p: 3, 
                  minWidth: 0, 
                  maxWidth: '100%', 
                  overflow: 'hidden',
                  textAlign: 'center',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                    Fecha de Inicio
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formatDate(business.startDate)}
                  </Typography>
                </Box>
              </Grid>

              {business.endDate && (
                <Grid xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    mb: 2.5, 
                    p: 3, 
                    minWidth: 0, 
                    maxWidth: '100%', 
                    overflow: 'hidden',
                    textAlign: 'center',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                      Fecha de Finalización
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {formatDate(business.endDate)}
                    </Typography>
                  </Box>
                </Grid>
              )}

              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ 
                  mb: 2.5, 
                  p: 3, 
                  minWidth: 0, 
                  maxWidth: '100%', 
                  overflow: 'hidden',
                  textAlign: 'center',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
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

              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ 
                  mb: 2.5, 
                  p: 3, 
                  minWidth: 0, 
                  maxWidth: '100%', 
                  overflow: 'hidden',
                  textAlign: 'center',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                    Estado del Chat
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: getChatStatus() === 'active' ? 'info.main' : 
                                getChatStatus() === 'closed' ? 'success.main' : 'grey.400'
                      }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {getChatStatusText(getChatStatus())}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={12} md={4} sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 2 }}>
              {canReview(business.status) && (
                <Button
                  variant="outlined"
                  onClick={() => onReview(business.id)}
                  fullWidth
                  sx={{
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                      border: '2px solid rgba(99, 102, 241, 0.3)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    }
                  }}
                >
                  Escribir Reseña
                </Button>
              )}

              {business.status === 'completed' && reviews.some(r => r.fromUserId === user?.id) && (
                <Button
                  variant="text"
                  disabled
                  fullWidth
                  sx={{
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 2,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)',
                    color: 'success.main',
                    '&:disabled': {
                      color: 'success.main',
                      opacity: 0.8,
                    }
                  }}
                >
                  ✓ Reseña Enviada
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
