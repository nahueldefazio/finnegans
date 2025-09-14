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
  Skeleton,
  Fade,
  Slide,
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
  const [initialLoading, setInitialLoading] = useState(true);
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
        setInitialLoading(false);
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
      setInitialLoading(false);
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

  if (initialLoading) {
    return (
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
        minHeight: '100vh',
        p: 3,
      }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Skeleton variant="text" width="60%" height={80} sx={{ mx: 'auto', mb: 3 }} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: 4 }} />
        </Box>
        
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Grid container spacing={4}>
              {[1, 2, 3, 4].map((item) => (
                <Grid xs={12} md={6} key={item}>
                  <Skeleton variant="rounded" height={56} />
                </Grid>
              ))}
              <Grid xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Skeleton variant="rounded" width={250} height={56} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h3" 
            component="h1" 
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
            🔍 Buscar Servicios/Productos
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              lineHeight: 1.6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Encuentra los mejores servicios y productos para tu empresa
          </Typography>
        </Box>
      </Fade>

      <Slide direction="up" in timeout={1000}>
        <Box>
          <DataStatusIndicator onRefresh={loadAllData} />

          <Card sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              <Grid container spacing={4}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Buscar por nombre o descripción"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1.5, color: 'primary.main' }} />,
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <FormControl 
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                        },
                      },
                    }}
                  >
                    <InputLabel>📍 Ubicación</InputLabel>
                    <Select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      label="📍 Ubicación"
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
                        <Chip 
                          variant="outlined" 
                          label={option} 
                          {...getTagProps({ index })}
                          sx={{
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                            },
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="🛠️ Tipos de servicios"
                        placeholder="Selecciona los tipos de servicios que necesitas"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2.5,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="💰 Presupuesto máximo (USD)"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography 
                          sx={{ 
                            mr: 1.5, 
                            fontWeight: 600,
                            color: 'primary.main',
                            fontSize: '1.1rem',
                          }}
                        >
                          $
                        </Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleSearch}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                      sx={{ 
                        minWidth: 250, 
                        py: 2,
                        px: 4,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 30px rgba(99, 102, 241, 0.4)',
                          background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                        },
                        '&:active': {
                          transform: 'translateY(-1px)',
                        },
                        '&:disabled': {
                          background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                          transform: 'none',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {loading ? '🔍 Buscando...' : '🔍 Buscar Servicios'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {error && (
            <Fade in timeout={500}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4,
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                }}
                action={
                  error.includes('inicializar') ? (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => navigate('/admin/data')}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Ir a Administración
                    </Button>
                  ) : null
                }
              >
                {error}
              </Alert>
            </Fade>
          )}

          {matches.length > 0 && (
            <Fade in timeout={800}>
              <Box sx={{ mt: 2 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    mb: 4,
                    textAlign: 'center',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🎯 Servicios Disponibles ({matches.length} opciones encontradas)
                </Typography>
                
                {matches.map((match, index) => {
                  const proveedor = getProveedorById(match.proveedorId);
                  if (!proveedor) return null;
                  
                  return (
                    <Slide 
                      key={match.id} 
                      direction="up" 
                      in 
                      timeout={600 + (index * 100)}
                    >
                      <Box sx={{ mb: 3 }}>
                        <MatchCard
                          match={match}
                          proveedor={proveedor}
                          onContact={handleContact}
                        />
                      </Box>
                    </Slide>
                  );
                })}
              </Box>
            </Fade>
          )}

          {!loading && matches.length === 0 && (
            <Fade in timeout={600}>
              <Card sx={{
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <CardContent sx={{ 
                  textAlign: 'center', 
                  py: 8, 
                  px: 4,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
                }}>
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ 
                      mb: 3,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    🔍 No se encontraron servicios
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.6,
                      maxWidth: 400,
                      mx: 'auto',
                    }}
                  >
                    Intenta ajustar tus criterios de búsqueda o contacta con nosotros
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          )}
        </Box>
      </Slide>

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
