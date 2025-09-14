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
  Button,
} from '@mui/material';
import { Business as BusinessIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Chat } from '../../types';
import { getChatsByUserId } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { initializeChatsAndMessages } from '../../services/dataInitializationService';
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

  const initializeSampleChats = useCallback(async () => {
    setLoading(true);
    try {
      initializeChatsAndMessages();
      // Recargar chats después de inicializar
      await loadChats();
    } catch (error) {
      console.error('Error initializing sample chats:', error);
    } finally {
      setLoading(false);
    }
  }, [loadChats]);

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
    // En una aplicación real, esto vendría del backend con los datos del usuario
    if (user?.type === 'pyme') {
      return 'Proveedor';
    } else {
      return 'PyME';
    }
  };

  if (loading) {
    return (
      <Paper sx={{ height: '100%', p: 2 }}>
        <Typography>Cargando conversaciones...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Typography variant="h6">Conversaciones</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {chats.length === 0 && !loading && (
            <Button
              size="small"
              variant="contained"
              onClick={initializeSampleChats}
              disabled={loading}
              color="primary"
            >
              Crear Chats de Ejemplo
            </Button>
          )}
          <IconButton
            size="small"
            onClick={loadChats}
            disabled={loading}
            title="Actualizar conversaciones"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      
      {chats.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Sin conversaciones
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No tienes conversaciones activas
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Haz clic en "Crear Chats de Ejemplo" para generar conversaciones de demostración
            </Typography>
            <Typography variant="body2" color="text.secondary">
              O inicia una conversación con un proveedor desde la página de búsqueda
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
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
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

