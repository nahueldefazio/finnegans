import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { dataPersistenceService } from '../../services/dataPersistenceService';
import { initializeSampleData, getDataStats } from '../../services/dataInitializationService';

interface DiagnosticResult {
  service: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const DataDiagnosticPanel: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    try {
      // Verificar localStorage
      try {
        const testKey = 'pyme_connect_test';
        const testValue = { test: true, timestamp: Date.now() };
        localStorage.setItem(testKey, JSON.stringify(testValue));
        const retrieved = JSON.parse(localStorage.getItem(testKey) || '{}');
        localStorage.removeItem(testKey);
        
        if (retrieved.test === true) {
          results.push({
            service: 'localStorage',
            status: 'success',
            message: 'localStorage funciona correctamente',
          });
        } else {
          results.push({
            service: 'localStorage',
            status: 'error',
            message: 'localStorage no funciona correctamente',
          });
        }
      } catch (error) {
        results.push({
          service: 'localStorage',
          status: 'error',
          message: `Error en localStorage: ${error}`,
        });
      }

      // Verificar servicios de persistencia
      const services = [
        { name: 'users', service: dataPersistenceService.users, method: 'getAllUsers' },
        { name: 'pymeProfiles', service: dataPersistenceService.pymeProfiles, method: 'getAllProfiles' },
        { name: 'proveedorProfiles', service: dataPersistenceService.proveedorProfiles, method: 'getAllProfiles' },
        { name: 'matches', service: dataPersistenceService.matches, method: 'getAllMatches' },
        { name: 'chats', service: dataPersistenceService.chats, method: 'getAllChats' },
        { name: 'messages', service: dataPersistenceService.messages, method: 'getAllMessages' },
        { name: 'businesses', service: dataPersistenceService.businesses, method: 'getAllBusinesses' },
        { name: 'reviews', service: dataPersistenceService.reviews, method: 'getAllReviews' },
      ];

      for (const { name, service, method } of services) {
        try {
          const data = (service as any)[method]();
          results.push({
            service: name,
            status: 'success',
            message: `${data.length} registros encontrados`,
            details: data,
          });
        } catch (error) {
          results.push({
            service: name,
            status: 'error',
            message: `Error al acceder a ${name}: ${error}`,
          });
        }
      }

      // Verificar estadísticas
      try {
        const stats = getDataStats();
        results.push({
          service: 'estadísticas',
          status: 'success',
          message: 'Estadísticas calculadas correctamente',
          details: stats,
        });
      } catch (error) {
        results.push({
          service: 'estadísticas',
          status: 'error',
          message: `Error al calcular estadísticas: ${error}`,
        });
      }

      // Verificar inicialización
      try {
        initializeSampleData();
        results.push({
          service: 'inicialización',
          status: 'success',
          message: 'Inicialización de datos completada',
        });
      } catch (error) {
        results.push({
          service: 'inicialización',
          status: 'error',
          message: `Error en inicialización: ${error}`,
        });
      }

    } catch (error) {
      results.push({
        service: 'sistema',
        status: 'error',
        message: `Error general del sistema: ${error}`,
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <WarningIcon color="disabled" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        background: 'linear-gradient(45deg, #6366f1, #ec4899)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 600,
        mb: 3
      }}>
        Diagnóstico de Datos
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Estado del Sistema
                </Typography>
                <Button
                  variant="contained"
                  onClick={runDiagnostics}
                  disabled={isRunning}
                >
                  {isRunning ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
                </Button>
              </Box>

              {diagnostics.length === 0 && !isRunning && (
                <Alert severity="info">
                  Haz clic en "Ejecutar Diagnóstico" para verificar el estado del sistema.
                </Alert>
              )}

              {diagnostics.map((diagnostic, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      {getStatusIcon(diagnostic.status)}
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {diagnostic.service}
                      </Typography>
                      <Chip
                        label={diagnostic.status}
                        color={getStatusColor(diagnostic.status) as any}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {diagnostic.message}
                    </Typography>
                    
                    {diagnostic.details && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Detalles:
                        </Typography>
                        {typeof diagnostic.details === 'object' ? (
                          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                            <pre style={{ margin: 0, fontSize: '0.875rem', overflow: 'auto' }}>
                              {JSON.stringify(diagnostic.details, null, 2)}
                            </pre>
                          </Box>
                        ) : (
                          <Typography variant="body2">
                            {diagnostic.details}
                          </Typography>
                        )}
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Navegador
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="User Agent"
                    secondary={navigator.userAgent}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="localStorage disponible"
                    secondary={typeof Storage !== 'undefined' ? 'Sí' : 'No'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Capacidad de localStorage"
                    secondary={(() => {
                      try {
                        let total = 0;
                        for (let key in localStorage) {
                          if (localStorage.hasOwnProperty(key)) {
                            total += localStorage[key].length + key.length;
                          }
                        }
                        return `${total} caracteres utilizados`;
                      } catch (e) {
                        return 'No disponible';
                      }
                    })()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="URL actual"
                    secondary={window.location.href}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataDiagnosticPanel;
