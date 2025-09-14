import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import ChatList from '../components/chat/ChatList';
import ChatInterface from '../components/chat/ChatInterface';
import { Chat } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { createChat, getChatById } from '../services/chatService';

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Función para crear un chat automáticamente y guardarlo
  const createChatFromMatch = useCallback(async (matchId: string): Promise<Chat> => {
    if (isCreatingChat) {
      // Si ya se está creando un chat, no crear otro
      console.log('Ya se está creando un chat, evitando duplicado');
      return selectedChat || {
        id: `chat-${matchId}`,
        pymeId: user?.id || '1',
        proveedorId: matchId,
        matchId: matchId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    setIsCreatingChat(true);
    try {
      // Crear el chat usando el servicio para que se guarde en persistencia
      const newChat = await createChat(
        user?.id || '1',
        matchId,
        matchId
      );
      
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      // Fallback: crear chat local si falla el servicio
      return {
        id: `chat-${matchId}`,
        pymeId: user?.id || '1',
        proveedorId: matchId,
        matchId: matchId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } finally {
      setIsCreatingChat(false);
    }
  }, [user?.id, isCreatingChat, selectedChat]);

  // Manejar el parámetro chatId de la URL
  useEffect(() => {
    if (chatId && !isCreatingChat) {
      // Verificar si es un chat existente o un nuevo matchId
      getChatById(chatId).then((existingChat: Chat | null) => {
        if (existingChat) {
          // Es un chat existente, solo seleccionarlo
          setSelectedChat(existingChat);
        } else {
          // Es un matchId nuevo, crear el chat
          createChatFromMatch(chatId).then(chat => {
            setSelectedChat(chat);
          });
        }
      }).catch(() => {
        // Si falla, asumir que es un matchId nuevo
        createChatFromMatch(chatId).then(chat => {
          setSelectedChat(chat);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, isCreatingChat]); // createChatFromMatch es estable y no necesita estar en dependencias

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    // Solo actualizar la URL sin crear un nuevo chat
    navigate(`/chat/${chat.id}`);
  };

  const getOtherUser = (chat: Chat) => {
    // Obtener información del proveedor desde el servicio
    const { getProveedorById } = require('../services/matchingService');
    const proveedor = getProveedorById(chat.proveedorId);
    
    return {
      name: proveedor?.companyName || 'Proveedor',
      type: 'proveedor' as 'pyme' | 'proveedor',
    };
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 140px)', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      maxHeight: 'calc(100vh - 140px)'
    }}>
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Chat
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comunícate con proveedores y PyMEs
        </Typography>
      </Box>

      <Grid container sx={{ 
        flex: 1, 
        minHeight: 0,
        height: '100%',
        overflow: 'hidden'
      }}>
        <Grid xs={12} md={4} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: 0,
          height: '100%',
          overflow: 'hidden'
        }}>
          <ChatList
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChat?.id}
          />
        </Grid>
        
        <Grid xs={12} md={8} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: 0,
          height: '100%',
          overflow: 'hidden'
        }}>
          {selectedChat ? (
            <ChatInterface
              chat={selectedChat}
              otherUser={getOtherUser(selectedChat)}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Selecciona una conversación para comenzar
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatPage;
