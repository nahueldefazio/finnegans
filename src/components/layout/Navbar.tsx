import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Chat as ChatIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Psychology as SmartIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/search', label: 'Buscar', icon: <SearchIcon /> },
    { path: '/smart-matches', label: 'Mis Matches', icon: <SmartIcon /> },
    { path: '/add-service', label: 'Agregar Servicios', icon: <AddIcon /> },
    { path: '/business', label: 'Mis Negocios', icon: <BusinessIcon /> },
    { path: '/chat', label: 'Chat', icon: <ChatIcon /> },
    { path: '/admin/data', label: 'Admin Panel', icon: <AdminIcon /> },
  ];

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 0, 
            mr: 4, 
            cursor: 'pointer',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
            }
          }}
          onClick={() => navigate('/dashboard')}
        >
          Finnegans
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                bgcolor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Profile Menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              p: 0.5,
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out',
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'primary.main',
                border: '2px solid rgba(255,255,255,0.2)',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                }
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls="mobile-menu"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 2,
            }
          }}
        >
          <MenuItem 
            onClick={() => handleNavigation('/profile')}
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: 'primary.lighter',
              }
            }}
          >
            <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="body2" fontWeight={500}>
              Mi Perfil
            </Typography>
          </MenuItem>
          <MenuItem 
            onClick={handleLogout}
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: 'error.lighter',
              }
            }}
          >
            <LogoutIcon sx={{ mr: 2, color: 'error.main' }} />
            <Typography variant="body2" fontWeight={500}>
              Cerrar Sesión
            </Typography>
          </MenuItem>
        </Menu>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 250,
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 2,
            }
          }}
        >
          {navigationItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  }
                }
              }}
            >
              {item.icon}
              <Typography sx={{ ml: 2, fontWeight: 500 }}>{item.label}</Typography>
            </MenuItem>
          ))}
          <MenuItem 
            onClick={() => handleNavigation('/profile')}
            sx={{
              py: 1.5,
              borderTop: '1px solid rgba(0,0,0,0.1)',
              mt: 1,
              '&:hover': {
                bgcolor: 'primary.lighter',
              }
            }}
          >
            <PersonIcon sx={{ color: 'primary.main' }} />
            <Typography sx={{ ml: 2, fontWeight: 500 }}>Mi Perfil</Typography>
          </MenuItem>
          <MenuItem 
            onClick={handleLogout}
            sx={{
              py: 1.5,
              borderTop: '1px solid rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'error.lighter',
              }
            }}
          >
            <LogoutIcon sx={{ color: 'error.main' }} />
            <Typography sx={{ ml: 2, fontWeight: 500 }}>Cerrar Sesión</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

