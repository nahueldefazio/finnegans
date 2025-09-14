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
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import BusinessCard from '../components/business/BusinessCard';
import ReviewDialog from '../components/business/ReviewDialog';
import { Business, Review } from '../types';
import { getBusinessesByUserId, updateBusinessStatus, getReviewsByUserId } from '../services/businessService';
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

  const handleUpdateStatus = async (businessId: string, status: Business['status']) => {
    try {
      const endDate = status === 'completed' ? new Date().toISOString() : undefined;
      await updateBusinessStatus(businessId, status, endDate);
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error updating business status:', error);
    }
  };

  const handleReview = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    setSelectedBusiness(business || null);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmitted = () => {
    loadData(); // Recargar datos para mostrar la nueva reseña
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getBusinessesByStatus = (status: Business['status']) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Mis Negocios
        </Typography>
        <IconButton
          onClick={loadData}
          disabled={loading}
          title="Actualizar datos"
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Gestiona tus proyectos y reseñas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="business tabs">
          <Tab label="Todos los Proyectos" />
          <Tab label="En Progreso" />
          <Tab label="Completados" />
          <Tab label="Mis Reseñas" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {businesses.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes proyectos aún
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Los proyectos aparecerán aquí cuando aceptes cotizaciones
              </Typography>
              <Button
                variant="outlined"
                onClick={loadData}
                disabled={loading}
                startIcon={<RefreshIcon />}
                sx={{ mt: 2 }}
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
              onUpdateStatus={handleUpdateStatus}
              onReview={handleReview}
              reviews={reviews}
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
              onUpdateStatus={handleUpdateStatus}
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
              onUpdateStatus={handleUpdateStatus}
              onReview={handleReview}
              reviews={reviews}
            />
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Reseñas que he dado
        </Typography>
        {getReviewsByType('given').length === 0 ? (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No has escrito reseñas aún
              </Typography>
            </CardContent>
          </Card>
        ) : (
          getReviewsByType('given').map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="body1" gutterBottom sx={{ mb: 1.5 }}>
                  {review.comment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proyecto #{review.businessId.slice(-6)} • {new Date(review.createdAt).toLocaleDateString('es-ES')}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}

        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Reseñas que he recibido
        </Typography>
        {getReviewsByType('received').length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No has recibido reseñas aún
              </Typography>
            </CardContent>
          </Card>
        ) : (
          getReviewsByType('received').map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="body1" gutterBottom sx={{ mb: 1.5 }}>
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

