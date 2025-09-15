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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ServiceCard from './ServiceCard';
import ProductCard from './ProductCard';
import DataStatusIndicator from '../common/DataStatusIndicator';
import { 
  getAllProveedores,
  searchServices,
  searchProducts
} from '../../services/matchingService';
import { Service, Product, ProveedorProfile } from '../../types';
import { useNavigate } from 'react-router-dom';
import { SERVICE_TYPES } from '../../constants/serviceTypes';

const SearchPage: React.FC = () => {
  // Estados para filtros básicos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  // Estados para filtros avanzados
  const [selectedServiceType, setSelectedServiceType] = useState<'service' | 'product' | ''>('');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Estados para resultados
  const [services, setServices] = useState<{service: Service, proveedor: ProveedorProfile}[]>([]);
  const [products, setProducts] = useState<{product: Product, proveedor: ProveedorProfile}[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');

  const navigate = useNavigate();

  // Datos para filtros
  const allProveedores = getAllProveedores();
  const allServices = Array.from(new Set(allProveedores.flatMap(p => p.services)));
  const allLocations = Array.from(new Set(allProveedores.map(p => p.location)));
  const availableServices = Array.from(new Set([...SERVICE_TYPES, ...allServices]));

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const proveedores = getAllProveedores();
      if (proveedores.length === 0) {
        setError('No se encontraron proveedores disponibles');
        setInitialLoading(false);
        return;
      }

      const servicesResults = await searchServices('', undefined, undefined);
      setServices(servicesResults);

      const productsResults = await searchProducts('', undefined, undefined);
      setProducts(productsResults);

    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleContactService = (serviceId: string) => {
    const serviceData = services.find(s => s.service.id === serviceId);
    if (serviceData) {
      // Navegar al chat con el proveedor que ofrece este servicio
      navigate(`/chat/${serviceData.proveedor.id}`);
    }
  };

  const handleContactProduct = (productId: string) => {
    const productData = products.find(p => p.product.id === productId);
    if (productData) {
      // Navegar al chat con el proveedor que ofrece este producto
      navigate(`/chat/${productData.proveedor.id}`);
    }
  };

  // Buscar servicios y productos
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const servicesResults = await searchServices(
        searchTerm,
        selectedCategory || undefined,
        maxPrice || undefined
      );
      setServices(servicesResults);

      const productsResults = await searchProducts(
        searchTerm,
        selectedCategory || undefined,
        maxPrice || undefined
      );
      setProducts(productsResults);

    } catch (err) {
      setError('Error al buscar servicios y productos');
      console.error('Error searching:', err);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar filtros y recargar
  const handleClearFilters = async () => {
    // Limpiar todos los filtros
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setMaxPrice('');
    setSelectedServiceType('');
    setSelectedDeliveryTime('');
    setSelectedFeatures([]);
    setSelectedTags([]);
    setOnlyAvailable(true);
    setShowAdvancedFilters(false);

    // Recargar todos los datos sin filtros
    await loadAllData();
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
                <Grid item xs={12} md={6} key={item}>
                  <Skeleton variant="rounded" height={56} />
                </Grid>
              ))}
              <Grid item xs={12}>
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
      <Slide direction="down" in={!initialLoading} timeout={500}>
        <Box>
          {/* Título principal */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              🔍 Buscar Servicios y Productos
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.4,
                mb: 3,
              }}
            >
              Encuentra los mejores proveedores para tu negocio
            </Typography>
            
          </Box>

          {/* Formulario de búsqueda */}
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="¿Qué estás buscando?"
                    placeholder="Ej: desarrollo web, marketing digital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Categoría"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                        },
                      }}
                    >
                      <MenuItem value="">Todas las categorías</MenuItem>
                      {availableServices.map((service) => (
                        <MenuItem key={service} value={service}>
                          {service}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Ubicación</InputLabel>
                    <Select
                      value={selectedLocation}
                      label="Ubicación"
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                        },
                      }}
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

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Precio máximo"
                    placeholder="Ej: 5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
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

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleSearch}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                      sx={{
                        minWidth: 200,
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
                      {loading ? '🔍 Buscando...' : '🔍 Buscar'}
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleClearFilters}
                      sx={{
                        minWidth: 180,
                        py: 2,
                        px: 4,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)',
                          borderColor: 'primary.dark',
                          backgroundColor: 'rgba(99, 102, 241, 0.05)',
                        },
                        '&:active': {
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      🗑️ Limpiar Filtros
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Mensaje de error */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '1rem',
                }
              }}
              action={
                error === 'No se encontraron proveedores disponibles' ? (
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={() => {
                      setError('');
                      loadAllData();
                    }}
                  >
                    Reintentar
                  </Button>
                ) : null
              }
            >
              {error}
            </Alert>
          )}

          {/* Indicador de estado de datos */}
          <Box sx={{ mb: 3 }}>
            <DataStatusIndicator />
          </Box>

          {/* Resultados */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: 'text.secondary',
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              {loading 
                ? 'Buscando...' 
                : services.length === 0 && products.length === 0
                  ? 'No se encontraron resultados'
                  : `Se encontraron ${services.length + products.length} resultados: ${services.length} servicios y ${products.length} productos`
              }
            </Typography>

            {/* Tabs para servicios y productos */}
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              centered
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  minHeight: 48,
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                }
              }}
            >
              <Tab 
                label={`Servicios (${services.length})`} 
                value="services"
              />
              <Tab 
                label={`Productos (${products.length})`} 
                value="products"
              />
            </Tabs>

            {/* Loading skeleton */}
            {loading && (
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={12} md={6} lg={4} key={item}>
                    <Card sx={{ borderRadius: 3 }}>
                      <CardContent>
                        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
                        <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Skeleton variant="text" width="40%" height={28} />
                          <Skeleton variant="rounded" width={100} height={36} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Servicios */}
            {!loading && activeTab === 'services' && services.length > 0 && (
              <Fade in={!loading} timeout={500}>
                <Grid container spacing={3}>
                  {services.map((serviceData, index) => (
                    <Grid item xs={12} md={6} lg={4} key={serviceData.service.id}>
                      <Slide 
                        direction="up" 
                        in={!loading} 
                        timeout={300 + index * 100}
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <Box>
                          <ServiceCard 
                            service={serviceData.service}
                            proveedor={serviceData.proveedor}
                            onContact={handleContactService}
                          />
                        </Box>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              </Fade>
            )}

            {/* Productos */}
            {!loading && activeTab === 'products' && products.length > 0 && (
              <Fade in={!loading} timeout={500}>
                <Grid container spacing={3}>
                  {products.map((productData, index) => (
                    <Grid item xs={12} md={6} lg={4} key={productData.product.id}>
                      <Slide 
                        direction="up" 
                        in={!loading} 
                        timeout={300 + index * 100}
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <Box>
                          <ProductCard 
                            product={productData.product}
                            proveedor={productData.proveedor}
                            onContact={handleContactProduct}
                          />
                        </Box>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              </Fade>
            )}

            {/* Sin resultados */}
            {!loading && services.length === 0 && products.length === 0 && (
              <Fade in={!loading} timeout={500}>
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  borderRadius: 3,
                  border: '1px solid rgba(99, 102, 241, 0.1)'
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      color: 'text.secondary',
                      fontWeight: 500 
                    }}
                  >
                    No se encontraron resultados
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 4, 
                      color: 'text.secondary',
                      maxWidth: 600,
                      mx: 'auto',
                      lineHeight: 1.6
                    }}
                  >
                    Intenta ajustar tus filtros de búsqueda o explora diferentes categorías para encontrar los servicios y productos que necesitas.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={handleClearFilters}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b5bd6 0%, #7c3aed 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                      }
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </Box>
              </Fade>
            )}
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};

export default SearchPage;