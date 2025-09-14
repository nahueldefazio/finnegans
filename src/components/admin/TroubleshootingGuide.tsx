import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TroubleshootingGuide: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>('common-issues');
  const navigate = useNavigate();

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const commonIssues = [
    {
      title: 'Error al cargar datos',
      description: 'Los datos no se cargan correctamente',
      solutions: [
        'Verificar que localStorage esté habilitado en el navegador',
        'Limpiar la caché del navegador',
        'Verificar que no haya errores de JavaScript en la consola',
        'Reinicializar los datos desde el panel de administración',
      ],
      severity: 'error' as const,
    },
    {
      title: 'Datos no persisten',
      description: 'Los datos se pierden al recargar la página',
      solutions: [
        'Verificar que localStorage esté funcionando',
        'Comprobar que no se esté ejecutando en modo incógnito',
        'Verificar que el navegador no esté en modo privado',
        'Exportar datos como backup antes de limpiar',
      ],
      severity: 'warning' as const,
    },
    {
      title: 'Rendimiento lento',
      description: 'La aplicación se ejecuta lentamente',
      solutions: [
        'Limpiar datos antiguos innecesarios',
        'Verificar la cantidad de datos almacenados',
        'Cerrar otras pestañas del navegador',
        'Reiniciar el navegador',
      ],
      severity: 'info' as const,
    },
    {
      title: 'Errores de importación/exportación',
      description: 'Problemas al importar o exportar datos',
      solutions: [
        'Verificar que el archivo JSON tenga el formato correcto',
        'Asegurarse de que el archivo no esté corrupto',
        'Verificar que no haya caracteres especiales en el archivo',
        'Intentar con un archivo de ejemplo más pequeño',
      ],
      severity: 'warning' as const,
    },
  ];

  const quickFixes = [
    {
      title: 'Reinicializar Datos',
      description: 'Cargar datos de ejemplo frescos',
      action: () => {
        if (window.confirm('¿Estás seguro de que quieres reinicializar todos los datos? Esto eliminará los datos actuales.')) {
          localStorage.clear();
          window.location.reload();
        }
      },
      icon: <RefreshIcon />,
    },
    {
      title: 'Limpiar Caché',
      description: 'Limpiar la caché del navegador',
      action: () => {
        if (window.confirm('¿Limpiar la caché del navegador? Esto cerrará la aplicación.')) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
        }
      },
      icon: <StorageIcon />,
    },
    {
      title: 'Ejecutar Diagnóstico',
      description: 'Verificar el estado del sistema',
      action: () => navigate('/admin/diagnostic'),
      icon: <BugReportIcon />,
    },
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="disabled" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

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
        Guía de Solución de Problemas
      </Typography>

      <Grid container spacing={3}>
        {/* Soluciones Rápidas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Soluciones Rápidas
              </Typography>
              <Grid container spacing={2}>
                {quickFixes.map((fix, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={fix.icon}
                      onClick={fix.action}
                      sx={{ height: '100%', flexDirection: 'column', p: 2 }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {fix.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fix.description}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Problemas Comunes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Problemas Comunes y Soluciones
              </Typography>
              
              {commonIssues.map((issue, index) => (
                <Accordion 
                  key={index} 
                  expanded={expanded === `issue-${index}`} 
                  onChange={handleChange(`issue-${index}`)}
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      {getSeverityIcon(issue.severity)}
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {issue.title}
                      </Typography>
                      <Chip
                        label={issue.severity}
                        color={getSeverityColor(issue.severity) as any}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {issue.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Soluciones:
                    </Typography>
                    <List dense>
                      {issue.solutions.map((solution, solutionIndex) => (
                        <ListItem key={solutionIndex}>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={solution} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Información del Navegador */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Sistema
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Navegador:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {navigator.userAgent.split(' ').slice(-2).join(' ')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    localStorage:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {typeof Storage !== 'undefined' ? 'Disponible' : 'No disponible'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    URL:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {window.location.origin}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Timestamp:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Consejos de Prevención */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consejos de Prevención
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Para evitar problemas futuros, sigue estos consejos:
              </Alert>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Exporta tus datos regularmente"
                    secondary="Crea backups periódicos de tu información"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mantén tu navegador actualizado"
                    secondary="Las versiones más recientes tienen mejor soporte para localStorage"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Evita el modo incógnito"
                    secondary="localStorage puede no funcionar correctamente en modo privado"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="No limpies la caché del navegador"
                    secondary="Esto puede eliminar los datos almacenados"
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

export default TroubleshootingGuide;
