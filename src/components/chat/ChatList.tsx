import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Paper,
  Chip,
  IconButton,
  Skeleton,
} from '@mui/material';
import { Business as BusinessIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Chat } from '../../types';
import { getChatsByUserId } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { getProveedorById } from '../../services/matchingService';
import { dataPersistenceService } from '../../services/dataPersistenceService';
import CustomScrollbar from '../common/CustomScrollbar';

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  selectedChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadChats = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const userChats = await getChatsByUserId(user.id);
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);


  // Cargar chats automáticamente cuando se monta el componente
  useEffect(() => {
    if (user?.id) {
      loadChats();
    }
  }, [user?.id, loadChats]);

  // Escuchar eventos personalizados para actualizar la lista automáticamente
  useEffect(() => {
    const handleChatCreated = () => {
      if (user?.id) {
        loadChats();
      }
    };

    const handleMessageCreated = () => {
      if (user?.id) {
        loadChats();
      }
    };

    // Escuchar eventos personalizados
    window.addEventListener('chatCreated', handleChatCreated);
    window.addEventListener('chatMessageCreated', handleMessageCreated);

    return () => {
      window.removeEventListener('chatCreated', handleChatCreated);
      window.removeEventListener('chatMessageCreated', handleMessageCreated);
    };
  }, [user?.id, loadChats]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getOtherUserName = (chat: Chat) => {
    // Obtener el nombre real del proveedor o PyME
    if (user?.type === 'pyme') {
      const proveedor = getProveedorById(chat.proveedorId);
      return proveedor?.companyName || 'Proveedor';
    } else {
      // Si el usuario es proveedor, obtener el nombre de la PyME
      const pymeProfile = dataPersistenceService.pymeProfiles.getProfileByUserId(chat.pymeId);
      return pymeProfile?.companyName || 'PyME';
    }
  };

  if (loading) {
    return (
      <Paper sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid', 
          borderColor: 'divider', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
        }}>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
                <Skeleton variant="text" width="15%" height={20} />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 3,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
    }}>
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
      }}>
        <Typography 
          variant="h6"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          💬 Conversaciones
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <IconButton
            size="small"
            onClick={loadChats}
            disabled={loading}
            title="Actualizar conversaciones"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2.5,
              p: 1.5,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.1) rotate(180deg)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
              },
              '&:disabled': {
                transform: 'none',
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      
      {chats.length === 0 ? (
        <Box sx={{ 
          p: 5, 
          textAlign: 'center', 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
        }}>
          <Box sx={{ maxWidth: 400 }}>
            <Typography 
              variant="h6" 
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
              💬 Sin conversaciones
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2, lineHeight: 1.6 }}>
              No tienes conversaciones activas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Inicia una conversación con un proveedor desde la página de búsqueda o Smart Matches
            </Typography>
          </Box>
        </Box>
      ) : (
        <CustomScrollbar
          sx={{ 
            flex: 1, 
            overflow: 'auto',
          }}
        >
          <List sx={{ p: 0 }}>
            {chats.map((chat) => (
              <ListItem
                key={chat.id}
                button
                onClick={() => onSelectChat(chat)}
                selected={selectedChatId === chat.id}
                sx={{
                  width: 'auto',
                  borderRadius: 2.5,
                  mx: 1.5,
                  my: 0.75,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    }
                  }}>
                    <BusinessIcon />
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {getOtherUserName(chat)}
                      </Typography>
                      <Chip
                        label={user?.type === 'pyme' ? 'Proveedor' : 'PyME'}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      {chat.status === 'closed' && (
                        <Chip
                          label="Cerrado"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      {chat.lastMessage && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 200,
                          }}
                        >
                          {chat.lastMessage.type === 'quotation' 
                            ? '💰 Cotización enviada'
                            : chat.lastMessage.content
                          }
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : 
                         formatTime(chat.createdAt)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CustomScrollbar>
      )}
    </Paper>
  );
};

export default ChatList;

