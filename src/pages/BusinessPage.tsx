import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Button,
  IconButton,
  Rating,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import BusinessCard from '../components/business/BusinessCard';
import ReviewDialog from '../components/business/ReviewDialog';
import { Business, Review } from '../types';
import { getBusinessesByUserId, getReviewsByUserId } from '../services/businessService';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`business-tabpanel-${index}`}
      aria-labelledby={`business-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, pt: 4 }}>{children}</Box>}
    </div>
  );
};

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError('');

    try {
      const [businessData, reviewData] = await Promise.all([
        getBusinessesByUserId(user.id),
        getReviewsByUserId(user.id),
      ]);

      setBusinesses(businessData);
      setReviews(reviewData);
    } catch (err) {
      console.error('Error loading business data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };


  const handleReview = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    setSelectedBusiness(business || null);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmitted = () => {
    loadData(); // Recargar datos para mostrar la nueva reseña
    setTabValue(3); // Cambiar automáticamente a la pestaña de reseñas
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getBusinessesByStatus = (status: Business['status']) => {
    if (status === 'in_progress') {
      // Incluir tanto 'pending' como 'in_progress' en "En Progreso"
      return businesses.filter(business => business.status === 'pending' || business.status === 'in_progress');
    }
    return businesses.filter(business => business.status === status);
  };

  const getReviewsByType = (type: 'given' | 'received') => {
    if (type === 'given') {
      return reviews.filter(review => review.fromUserId === user?.id);
    } else {
      return reviews.filter(review => review.toUserId === user?.id);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        gap: 3,
      }}>
        <CircularProgress 
          size={60}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}
        >
          Cargando tus negocios...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
      minHeight: '100vh',
      p: 3,
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 5,
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          💼 Mis Negocios
        </Typography>
        <IconButton
          onClick={loadData}
          disabled={loading}
          title="Actualizar datos"
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            borderRadius: 2.5,
            p: 1.5,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.1) rotate(180deg)',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
            },
            '&:disabled': {
              transform: 'none',
            }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 5 }}>
        Gestiona tus proyectos y reseñas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        mb: 4,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="business tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                color: 'primary.main',
                transform: 'translateY(-2px)',
              },
              '&.Mui-selected': {
                color: 'primary.main',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              }
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              height: 3,
              borderRadius: '3px 3px 0 0',
            }
          }}
        >
          <Tab label="📋 Todos los Proyectos" />
          <Tab label="⚡ En Progreso" />
          <Tab label="✅ Completados" />
          <Tab label="⭐ Mis Reseñas" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {businesses.length === 0 ? (
          <Card sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ 
              textAlign: 'center', 
              py: 10, 
              px: 6,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
            }}>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                💼 No tienes proyectos aún
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                Los proyectos aparecerán aquí cuando aceptes cotizaciones de proveedores
              </Typography>
              <Button
                variant="outlined"
                onClick={loadData}
                disabled={loading}
                startIcon={<RefreshIcon />}
                sx={{ 
                  mt: 2,
                  borderRadius: 2.5,
                  px: 4,
                  py: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                  },
                }}
              >
                Actualizar
              </Button>
            </CardContent>
          </Card>
        ) : (
          businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onReview={handleReview}
              reviews={reviews}
              loading={false}
            />
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {getBusinessesByStatus('in_progress').length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes proyectos en progreso
              </Typography>
            </CardContent>
          </Card>
        ) : (
          getBusinessesByStatus('in_progress').map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onReview={handleReview}
              reviews={reviews}
            />
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {getBusinessesByStatus('completed').length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes proyectos completados
              </Typography>
            </CardContent>
          </Card>
        ) : (
          getBusinessesByStatus('completed').map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onReview={handleReview}
              reviews={reviews}
            />
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Reseñas que he dado
        </Typography>
        {getReviewsByType('given').length === 0 ? (
          <Card sx={{ 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ 
              textAlign: 'center', 
              py: 8, 
              px: 4,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
            }}>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ⭐ No has escrito reseñas aún
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Las reseñas que escribas aparecerán aquí
              </Typography>
            </CardContent>
          </Card>
        ) : (
          getReviewsByType('given').map((review) => (
            <Card key={review.id} sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {review.rating}/5
                  </Typography>
                </Box>
                <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                  {review.comment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proyecto #{review.businessId.slice(-6)} • {new Date(review.createdAt).toLocaleDateString('es-ES')}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}

        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
          Reseñas que he recibido
        </Typography>
        {getReviewsByType('received').length === 0 ? (
          <Card sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ 
              textAlign: 'center', 
              py: 8, 
              px: 4,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
            }}>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ⭐ No has recibido reseñas aún
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Las reseñas que recibas aparecerán aquí
              </Typography>
            </CardContent>
          </Card>
        ) : (
          getReviewsByType('received').map((review) => (
            <Card key={review.id} sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {review.rating}/5
                  </Typography>
                </Box>
                <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                  {review.comment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proyecto #{review.businessId.slice(-6)} • {new Date(review.createdAt).toLocaleDateString('es-ES')}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </TabPanel>

      <ReviewDialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        business={selectedBusiness}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </Box>
  );
};

export default BusinessPage;

