import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { dataPersistenceService } from '../../services/dataPersistenceService';
import { sendMessage } from '../../services/chatService';

const ChatDebugPanel: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [testMessage, setTestMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    const allChats = dataPersistenceService.chats.getAllChats();
    const allMessages = dataPersistenceService.messages.getAllMessages();
    
    setChats(allChats);
    setMessages(allMessages);
    
    if (allChats.length > 0 && !selectedChat) {
      setSelectedChat(allChats[0].id);
    }
  }, [selectedChat]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSendTestMessage = async () => {
    if (!testMessage.trim() || !selectedChat) return;
    
    setLoading(true);
    try {
      await sendMessage(selectedChat, 'test-user', testMessage);
      setTestMessage('');
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error sending test message:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedChatMessages = messages.filter(msg => msg.chatId === selectedChat);

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
        Debug del Chat
      </Typography>

      <Grid container spacing={3}>
        {/* Estadísticas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Estadísticas del Chat
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadData}
                >
                  Actualizar
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                      {chats.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chats
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="secondary" sx={{ fontWeight: 600 }}>
                      {messages.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mensajes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="info" sx={{ fontWeight: 600 }}>
                      {selectedChatMessages.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mensajes en Chat Seleccionado
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success" sx={{ fontWeight: 600 }}>
                      {new Set(messages.map(m => m.chatId)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chats con Mensajes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Chats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chats Disponibles
              </Typography>
              <List dense>
                {chats.map((chat) => (
                  <ListItem
                    key={chat.id}
                    button
                    selected={selectedChat === chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <ListItemText
                      primary={`Chat ${chat.id.slice(-8)}`}
                      secondary={`${chat.pymeId} ↔ ${chat.proveedorId}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Mensajes del Chat Seleccionado */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mensajes del Chat Seleccionado
              </Typography>
              
              {selectedChat && (
                <>
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chat ID: {selectedChat}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de mensajes: {selectedChatMessages.length}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Mensaje de prueba..."
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendTestMessage();
                        }
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendTestMessage}
                      disabled={loading || !testMessage.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {selectedChatMessages.length === 0 ? (
                      <Alert severity="info">
                        No hay mensajes en este chat
                      </Alert>
                    ) : (
                      <List dense>
                        {selectedChatMessages.map((message, index) => (
                          <ListItem key={message.id || index}>
                            <ListItemText
                              primary={message.content}
                              secondary={`${message.senderId} - ${new Date(message.timestamp).toLocaleString()}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Información de Debug */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de Debug
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Este panel te permite verificar que los mensajes se estén guardando correctamente en localStorage.
                Envía un mensaje de prueba y verifica que aparezca en la lista.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Datos en localStorage:
                  </Typography>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, fontSize: '0.875rem' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {JSON.stringify({
                        chats: chats.length,
                        messages: messages.length,
                        storageKeys: Object.keys(localStorage).filter(key => key.startsWith('pyme_connect'))
                      }, null, 2)}
                    </pre>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Últimos mensajes:
                  </Typography>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, fontSize: '0.875rem' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {JSON.stringify(messages.slice(-3), null, 2)}
                    </pre>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatDebugPanel;
