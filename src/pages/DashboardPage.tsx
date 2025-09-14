import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Chat as ChatIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import ActivityChart from '../components/dashboard/ActivityChart';
import { DashboardMetrics } from '../types';
import { getDashboardMetrics } from '../services/dashboardService';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
  }, [user?.id]);

  const loadMetrics = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError('');

    try {
      const dashboardData = await getDashboardMetrics(user.id);
      setMetrics(dashboardData);
    } catch (err) {
      setError('Error al cargar las métricas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            ¡Hola, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí tienes un resumen de tu actividad en la plataforma
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/search')}
          >
            Buscar {user?.type === 'pyme' ? 'Proveedores' : 'PyMEs'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ChatIcon />}
            onClick={() => navigate('/chat')}
          >
            Ver Chats
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Matches Totales"
            value={metrics.totalMatches}
            icon={<TrendingUpIcon />}
            color="primary"
            trend={{ value: 15, isPositive: true }}
          />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Chats Activos"
            value={metrics.activeChats}
            icon={<ChatIcon />}
            color="secondary"
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Negocios Completados"
            value={metrics.completedBusinesses}
            icon={<BusinessIcon />}
            color="success"
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Calificación Promedio"
            value={metrics.averageRating.toFixed(1)}
            icon={<StarIcon />}
            color="warning"
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
      </Grid>

      {user?.type === 'proveedor' && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <MetricCard
              title="Ingresos Totales"
              value={formatCurrency(metrics.totalRevenue)}
              icon={<TrendingUpIcon />}
              color="success"
              trend={{ value: 20, isPositive: true }}
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {user?.type === 'proveedor' ? (
            <RevenueChart data={metrics.monthlyStats} />
          ) : (
            <ActivityChart data={metrics.monthlyStats} />
          )}
        </Grid>
        
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/search')}
                  startIcon={<SearchIcon />}
                >
                  {user?.type === 'pyme' ? 'Buscar Servicios/Productos' : 'Buscar PyMEs'}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/chat')}
                  startIcon={<ChatIcon />}
                >
                  Ver Conversaciones
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/business')}
                  startIcon={<BusinessIcon />}
                >
                  Mis Negocios
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/profile-setup')}
                >
                  Editar Perfil
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consejos
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  💡 {user?.type === 'pyme' 
                    ? 'Completa tu perfil para obtener mejores matches'
                    : 'Mantén actualizados tus precios para atraer más clientes'
                  }
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  💡 {user?.type === 'pyme'
                    ? 'Responde rápidamente a las cotizaciones'
                    : 'Envía cotizaciones detalladas y competitivas'
                  }
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  💡 Siempre deja reseñas después de completar un proyecto
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
