import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import MatchCard from './MatchCard';
import DataStatusIndicator from '../common/DataStatusIndicator';
import ConfirmDialog from '../common/ConfirmDialog';
import { findMatches, getProveedorById, getAllProveedores } from '../../services/matchingService';
import { PyMEProfile, Match, ProveedorProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SERVICE_TYPES } from '../../constants/serviceTypes';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    matchId: string;
    providerName: string;
  }>({
    open: false,
    matchId: '',
    providerName: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const allProveedores = getAllProveedores();
  const allServices = Array.from(new Set(allProveedores.flatMap(p => p.services)));
  const allLocations = Array.from(new Set(allProveedores.map(p => p.location)));
  
  // Usar los tipos de servicios centralizados como opciones principales
  const availableServices = Array.from(new Set([...SERVICE_TYPES, ...allServices]));

  // Cargar todos los datos automáticamente al montar el componente
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');

    try {
      // Verificar si hay proveedores disponibles
      const proveedores = getAllProveedores();
      if (proveedores.length === 0) {
        setError('No hay proveedores disponibles. Ve al panel de administración para inicializar los datos.');
        setLoading(false);
        return;
      }

      // Simular perfil de PyME basado en búsqueda
      const mockPymeProfile: PyMEProfile = {
        id: user?.id || '1',
        userId: user?.id || '1',
        companyName: 'Mi Empresa',
        industry: 'Tecnología',
        size: 'pequeña',
        location: 'Ciudad de México',
        needs: selectedServices,
        serviceTypes: selectedServices,
        budget: { min: 0, max: maxPrice || 10000 },
        description: 'Empresa en busca de servicios',
        contactInfo: { phone: '555-0123', address: 'Ciudad de México' },
      };

      const searchResults = await findMatches(mockPymeProfile);
      setMatches(searchResults);
    } catch (err) {
      console.error('Error al cargar servicios:', err);
      setError('Error al cargar los servicios. Verifica que los datos estén inicializados.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      // Simular perfil de PyME basado en búsqueda
      const mockPymeProfile: PyMEProfile = {
        id: user?.id || '1',
        userId: user?.id || '1',
        companyName: 'Mi Empresa',
        industry: 'Tecnología',
        size: 'pequeña',
        location: selectedLocation || 'Ciudad de México',
        needs: selectedServices.length > 0 ? selectedServices : allServices.slice(0, 3),
        serviceTypes: selectedServices.length > 0 ? selectedServices : allServices.slice(0, 3),
        budget: {
          min: 0,
          max: maxPrice || 1000,
        },
        description: searchTerm || 'Empresa buscando servicios',
        contactInfo: { phone: '', address: '' },
      };

      const searchResults = await findMatches(mockPymeProfile);
      setMatches(searchResults);
    } catch (err) {
      setError('Error al buscar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (matchId: string) => {
    // Obtener información del proveedor para la confirmación
    const proveedor = getProveedorById(matchId);
    const proveedorName = proveedor?.companyName || 'este proveedor';
    
    // Mostrar diálogo de confirmación
    setConfirmDialog({
      open: true,
      matchId,
      providerName: proveedorName,
    });
  };

  const handleConfirmChat = () => {
    // Navegar al chat con el matchId
    navigate(`/chat/${confirmDialog.matchId}`);
    setConfirmDialog({ open: false, matchId: '', providerName: '' });
  };

  const handleCancelChat = () => {
    setConfirmDialog({ open: false, matchId: '', providerName: '' });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
        Buscar Servicios/Productos
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Encuentra los mejores servicios y productos para tu empresa
      </Typography>

      <DataStatusIndicator onRefresh={loadAllData} />

      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar por nombre o descripción"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 1.5 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Ubicación</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  label="Ubicación"
                >
                  <MenuItem value="">Todas las ubicaciones</MenuItem>
                  {allLocations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} md={6}>
              <Autocomplete
                multiple
                options={availableServices}
                value={selectedServices}
                onChange={(_, newValue) => setSelectedServices(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipos de servicios"
                    placeholder="Selecciona los tipos de servicios que necesitas"
                    sx={{ mb: 1.5 }}
                  />
                )}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Presupuesto máximo (USD)"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                sx={{ mb: 1.5 }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>

            <Grid xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  sx={{ minWidth: 200, py: 1.5 }}
                >
                  {loading ? 'Buscando...' : 'Buscar Servicios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            error.includes('inicializar') ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate('/admin/data')}
              >
                Ir a Administración
              </Button>
            ) : null
          }
        >
          {error}
        </Alert>
      )}

      {matches.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Servicios Disponibles ({matches.length} opciones encontradas)
          </Typography>
          
          {matches.map((match) => {
            const proveedor = getProveedorById(match.proveedorId);
            if (!proveedor) return null;
            
            return (
              <MatchCard
                key={match.id}
                match={match}
                proveedor={proveedor}
                onContact={handleContact}
              />
            );
          })}
        </Box>
      )}

      {!loading && matches.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron servicios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta ajustar tus criterios de búsqueda o contacta con nosotros
            </Typography>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelChat}
        onConfirm={handleConfirmChat}
        title="Iniciar Conversación"
        message="¿Estás seguro de que quieres iniciar una conversación con este proveedor?"
        confirmText="Iniciar Chat"
        cancelText="Cancelar"
        providerName={confirmDialog.providerName}
      />
    </Box>
  );
};

export default SearchPage;
