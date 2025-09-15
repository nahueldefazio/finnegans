import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  Fade,
  Slide,
} from '@mui/material';
import { Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SmartMatchCard from '../components/matching/SmartMatchCard';
import { SmartMatchResult, findSmartMatches } from '../services/smartMatchingService';

const SmartMatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<SmartMatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const loadSmartMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar un ID por defecto ya que no hay autenticación
      const smartMatches = await findSmartMatches('default_user');
      setMatches(smartMatches);
      
      if (smartMatches.length === 0) {
        setError('No se encontraron matches personalizados. Actualiza tu perfil con más información para obtener mejores recomendaciones.');
      }
    } catch (err) {
      setError('Error al cargar los matches personalizados');
      console.error('Error loading smart matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSmartMatches();
  }, []);

  const handleContact = (proveedorId: string) => {
    navigate(`/chat?proveedorId=${proveedorId}`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    loadSmartMatches();
  };

  const handleGoToSearch = () => {
    navigate('/search');
  };


  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
      }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Analizando tus necesidades...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Encontrando los mejores proveedores para ti
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: 3,
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
      minHeight: '100vh',
    }}>
      <Slide direction="down" in={!loading} timeout={500}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
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
              🎯 Tus Matches Perfectos
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
              Servicios y productos seleccionados especialmente para tu empresa
            </Typography>

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Actualizar Matches
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleGoToSearch}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  },
                }}
              >
                Búsqueda Manual
              </Button>
            </Box>
          </Box>

          {/* Contenido */}
          {error ? (
            <Fade in={!!error} timeout={500}>
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
                action={
                  <Button color="inherit" size="small" onClick={handleRefresh}>
                    Reintentar
                  </Button>
                }
              >
                {error}
              </Alert>
            </Fade>
          ) : (
            <>
              {/* Tabs para diferentes tipos de matches */}
              <Box sx={{ mb: 4 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  centered
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    },
                  }}
                >
                  <Tab 
                    label={`Todos los Matches (${matches.length})`} 
                    icon={<span>🎯</span>}
                    iconPosition="start"
                  />
                  <Tab 
                    label={`Excelentes (${matches.filter(m => m.matchScore >= 0.8).length})`} 
                    icon={<span>⭐</span>}
                    iconPosition="start"
                  />
                  <Tab 
                    label={`Buenos (${matches.filter(m => m.matchScore >= 0.6 && m.matchScore < 0.8).length})`} 
                    icon={<span>👍</span>}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {/* Lista de matches */}
              <Box>
                {(() => {
                  let filteredMatches = matches;
                  
                  if (activeTab === 1) {
                    filteredMatches = matches.filter(m => m.matchScore >= 0.8);
                  } else if (activeTab === 2) {
                    filteredMatches = matches.filter(m => m.matchScore >= 0.6 && m.matchScore < 0.8);
                  }

                  if (filteredMatches.length === 0) {
                    return (
                      <Fade in={true} timeout={500}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                            No hay matches en esta categoría
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Intenta con otra categoría o actualiza tu perfil
                          </Typography>
                        </Box>
                      </Fade>
                    );
                  }

                  return filteredMatches.map((match, index) => (
                    <Fade key={`${match.proveedor.id}-${match.service.id}`} in={true} timeout={500 + index * 100}>
                      <Box>
                        <SmartMatchCard
                          match={match}
                          onContact={handleContact}
                        />
                      </Box>
                    </Fade>
                  ));
                })()}
              </Box>
            </>
          )}
        </Box>
      </Slide>
    </Box>
  );
};

export default SmartMatchesPage;
