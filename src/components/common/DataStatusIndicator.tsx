import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Button,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDataStats, hasData } from '../../services/dataInitializationService';

interface DataStatusIndicatorProps {
  onRefresh?: () => void;
}

const DataStatusIndicator: React.FC<DataStatusIndicatorProps> = ({ onRefresh }) => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkDataStatus();
  }, []);

  const checkDataStatus = () => {
    setLoading(true);
    try {
      const dataExists = hasData();
      const currentStats = getDataStats();
      
      setHasDataLoaded(dataExists);
      setStats(currentStats);
    } catch (error) {
      console.error('Error al verificar estado de datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    checkDataStatus();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Verificando estado de datos...
        </Typography>
      </Box>
    );
  }

  if (!hasDataLoaded) {
    return (
      <Alert 
        severity="warning" 
        sx={{ mb: 2 }}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
            >
              Verificar
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate('/admin/data')}
            >
              Inicializar Datos
            </Button>
          </Box>
        }
      >
        <Typography variant="body2">
          <strong>Datos no inicializados:</strong> No hay datos de ejemplo cargados. 
          Ve al panel de administración para inicializar los datos de demostración.
        </Typography>
      </Alert>
    );
  }

  const totalItems = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <CheckCircleIcon color="success" fontSize="small" />
      <Typography variant="body2" color="text.secondary">
        Datos cargados: {totalItems} elementos
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {stats.proveedorProfiles > 0 && (
          <Chip 
            label={`${stats.proveedorProfiles} proveedores`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        )}
        {stats.pymeProfiles > 0 && (
          <Chip 
            label={`${stats.pymeProfiles} PyMEs`} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        )}
        {stats.matches > 0 && (
          <Chip 
            label={`${stats.matches} matches`} 
            size="small" 
            color="info" 
            variant="outlined"
          />
        )}
      </Box>
      <Button
        size="small"
        onClick={handleRefresh}
        startIcon={<RefreshIcon />}
        sx={{ ml: 'auto' }}
      >
        Actualizar
      </Button>
    </Box>
  );
};

export default DataStatusIndicator;
