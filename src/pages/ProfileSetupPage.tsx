import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import PyMEProfileForm from '../components/profile/PyMEProfileForm';
import ProveedorProfileForm from '../components/profile/ProveedorProfileForm';

const ProfileSetupPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Cargando perfil...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1000, 
      mx: 'auto',
      minHeight: 'calc(100vh - 120px)',
      py: 1
    }}>
      {user.type === 'pyme' ? <PyMEProfileForm /> : <ProveedorProfileForm />}
    </Box>
  );
};

export default ProfileSetupPage;

