import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  initializeSampleData,
  initializeServicesAndProducts,
  clearAllData,
  clearSampleProveedores,
  exportData,
  importData,
  hasData,
  getDataStats,
} from '../../services/dataInitializationService';

const DataManagementPanel: React.FC = () => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importDataText, setImportDataText] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    updateStats();
  }, []);

  const updateStats = () => {
    setStats(getDataStats());
  };

  const handleInitializeData = () => {
    try {
      initializeSampleData();
      updateStats();
      setAlert({ type: 'success', message: 'Datos de ejemplo inicializados correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al inicializar datos' });
    }
  };

  const handleClearData = () => {
    try {
      clearAllData();
      updateStats();
      setShowClearDialog(false);
      setAlert({ type: 'success', message: 'Todos los datos han sido eliminados' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar datos' });
    }
  };

  const handleClearSampleProveedores = () => {
    try {
      clearSampleProveedores();
      updateStats();
      setAlert({ type: 'success', message: 'Proveedores de ejemplo eliminados correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al limpiar proveedores de ejemplo' });
    }
  };

  const handleInitializeServices = async () => {
    try {
      setAlert({ type: 'success', message: 'Inicializando servicios y productos...' });
      await initializeServicesAndProducts();
      updateStats();
      setAlert({ type: 'success', message: 'Servicios y productos inicializados correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al inicializar servicios y productos' });
    }
  };

  const handleExportData = () => {
    try {
      const data = exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pyme_connect_data_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setAlert({ type: 'success', message: 'Datos exportados correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al exportar datos' });
    }
  };

  const handleImportData = () => {
    try {
      const data = JSON.parse(importDataText);
      importData(data);
      updateStats();
      setShowImportDialog(false);
      setImportDataText('');
      setAlert({ type: 'success', message: 'Datos importados correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al importar datos. Verifica el formato JSON.' });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportDataText(content);
      };
      reader.readAsText(file);
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
        Gestión de Datos
      </Typography>

      {alert && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert(null)}
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Estadísticas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estadísticas de Datos
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(stats).map(([key, value]) => (
                  <Grid item xs={6} sm={4} md={3} key={key}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                        {value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {key === 'users' ? 'Usuarios' :
                         key === 'pymeProfiles' ? 'Perfiles PyME' :
                         key === 'proveedorProfiles' ? 'Perfiles Proveedor' :
                         key === 'matches' ? 'Matches' :
                         key === 'chats' ? 'Chats' :
                         key === 'messages' ? 'Mensajes' :
                         key === 'businesses' ? 'Negocios' :
                         key === 'reviews' ? 'Reseñas' : key}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones de Datos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones de Datos
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleInitializeData}
                    disabled={hasData()}
                  >
                    Inicializar Datos de Ejemplo
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Carga datos de demostración
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => setShowClearDialog(true)}
                    disabled={!hasData()}
                  >
                    Limpiar Todos los Datos
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Elimina todos los datos almacenados
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={handleClearSampleProveedores}
                    disabled={stats.proveedores === 0}
                  >
                    Limpiar Proveedores de Ejemplo
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Elimina solo los proveedores de demostración
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="success"
                    fullWidth
                    onClick={handleInitializeServices}
                  >
                    Inicializar Servicios/Productos
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Agrega servicios y productos de ejemplo
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={handleExportData}
                    disabled={!hasData()}
                  >
                    Exportar Datos
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Descarga backup de datos
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => setShowImportDialog(true)}
                  >
                    Importar Datos
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Restaura datos desde backup
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate('/admin/diagnostic')}
                  >
                    Diagnóstico
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Verificar estado del sistema
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => navigate('/admin/troubleshooting')}
                  >
                    Solución de Problemas
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Guía para resolver errores
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="info"
                    fullWidth
                    onClick={() => navigate('/admin/chat-debug')}
                  >
                    Debug del Chat
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Verificar mensajes del chat
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Información del Sistema */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Sistema
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label="Almacenamiento Local" color="primary" variant="outlined" />
                <Chip label="Persistencia Automática" color="success" variant="outlined" />
                <Chip label="Datos de Ejemplo" color="info" variant="outlined" />
                <Chip label="Exportación/Importación" color="warning" variant="outlined" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Este sistema utiliza localStorage del navegador para persistir todos los datos de la aplicación.
                Los datos incluyen usuarios, perfiles, chats, mensajes, negocios, reseñas y matches.
                Puedes exportar e importar datos para hacer backups o migrar entre dispositivos.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para confirmar limpieza */}
      <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>Cancelar</Button>
          <Button onClick={handleClearData} color="error" variant="contained">
            Eliminar Todo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para importar datos */}
      <Dialog open={showImportDialog} onClose={() => setShowImportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Importar Datos</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              style={{ marginBottom: '16px' }}
            />
            <Typography variant="body2" color="text.secondary">
              O pega el contenido JSON directamente:
            </Typography>
          </Box>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={importDataText}
            onChange={(e) => setImportDataText(e.target.value)}
            placeholder="Pega aquí el contenido JSON de los datos a importar..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleImportData} 
            color="primary" 
            variant="contained"
            disabled={!importDataText.trim()}
          >
            Importar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataManagementPanel;
