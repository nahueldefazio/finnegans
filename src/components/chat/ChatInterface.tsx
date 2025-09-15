import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Menu,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  RequestQuote as QuoteIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Star as StarIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import ChatMessage from './ChatMessage';
import CloseChatDialog from './CloseChatDialog';
import RatingDialog from './RatingDialog';
import { Chat, Quotation } from '../../types';
import { respondToQuotation, closeChat } from '../../services/chatService';
import { createReview } from '../../services/businessService';
import { dataPersistenceService } from '../../services/dataPersistenceService';
import { useAuth } from '../../contexts/AuthContext';
import { useChatMessages } from '../../hooks/useChatMessages';
import CustomScrollbar from '../common/CustomScrollbar';

interface ChatInterfaceProps {
  chat: Chat;
  otherUser: { name: string; type: 'pyme' | 'proveedor' };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat, otherUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [quotation, setQuotation] = useState<Partial<Quotation>>({
    service: '',
    description: '',
    price: 0,
    currency: 'USD',
    terms: '',
  });
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { messages, loading, error, sendMessage: sendNewMessage, refreshMessages } = useChatMessages(chat.id);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  // Auto-scroll cuando se agregan nuevos mensajes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length]);

  // Detectar si el usuario está en la parte inferior del chat
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isAtBottom);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendNewMessage(user?.id || '', newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendQuotation = async () => {
    if (!quotation.service || !quotation.description || !quotation.price) return;

    const fullQuotation: Quotation = {
      id: `quote${Date.now()}`,
      service: quotation.service,
      description: quotation.description,
      price: quotation.price,
      currency: quotation.currency || 'USD',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      terms: quotation.terms || 'Pago 50% al inicio, 50% al finalizar',
      status: 'pending',
    };

    try {
      await sendNewMessage(
        user?.id || '',
        'Aquí tienes una cotización para tu proyecto:',
        'quotation',
        fullQuotation
      );
      setQuoteDialogOpen(false);
      setQuotation({
        service: '',
        description: '',
        price: 0,
        currency: 'USD',
        terms: '',
      });
    } catch (error) {
      console.error('Error sending quotation:', error);
    }
  };

  const handleRespondToQuotation = async (quotationId: string, status: 'accepted' | 'rejected') => {
    try {
      await respondToQuotation(quotationId, status);
      // Recargar mensajes para ver el estado actualizado
      refreshMessages();
    } catch (error) {
      console.error('Error responding to quotation:', error);
    }
  };

  const handleCloseChat = async (reason: string, comment: string, shouldRate: boolean) => {
    try {
      await closeChat(chat.id, reason, comment);
      setCloseDialogOpen(false);
      
      if (shouldRate) {
        setRatingDialogOpen(true);
      } else {
        // Recargar mensajes para ver el estado actualizado
        refreshMessages();
      }
    } catch (error) {
      console.error('Error closing chat:', error);
    }
  };

  const handleRateProvider = async (rating: number, comment: string) => {
    try {
      if (!user) return;

      // Buscar el negocio asociado al chat
      const business = dataPersistenceService.businesses.getAllBusinesses().find(b => b.chatId === chat.id);
      
      if (business) {
        // Crear la reseña
        await createReview(
          user.id,
          chat.proveedorId,
          business.id,
          rating,
          comment
        );
        console.log('Reseña creada exitosamente:', { rating, comment, businessId: business.id });
      } else {
        console.warn('No se encontró negocio asociado al chat para crear la reseña');
      }

      setRatingDialogOpen(false);
      // Recargar mensajes para ver el estado actualizado
      refreshMessages();
    } catch (error) {
      console.error('Error rating provider:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleOpenCloseDialog = () => {
    setMenuAnchor(null);
    setCloseDialogOpen(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      maxHeight: '100%',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid',
      borderColor: 'divider'
    }}>
      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: '12px 12px 0 0',
        flexShrink: 0,
        zIndex: 1,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Chat con {otherUser.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 'auto%' }}>
              <Chip 
                label={otherUser.type === 'pyme' ? 'PyME' : 'Proveedor'}
                size="small"
                color="primary"
                variant="outlined"
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
          </Box>
          {chat.status !== 'closed' && (
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
      </Paper>

      <Divider sx={{ flexShrink: 0 }} />

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ m: 2, flexShrink: 0 }}>
          {error}
        </Alert>
      )}

      {/* Messages */}
      <Box sx={{ 
        position: 'relative', 
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        bgcolor: 'grey.50'
      }}>
        <CustomScrollbar
          ref={messagesContainerRef}
          onScroll={handleScroll}
          sx={{
            height: '100%',
            overflow: 'auto',
            p: 3,
            scrollbarWidth: '8px',
            scrollbarThumbColor: 'rgba(99, 102, 241, 0.5)',
            scrollbarThumbHoverColor: 'rgba(99, 102, 241, 0.7)',
            scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)',
            // Mejorar la experiencia de scroll
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(99, 102, 241, 0.5)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.7)',
              },
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography>Cargando mensajes...</Typography>
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onRespondToQuotation={handleRespondToQuotation}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </CustomScrollbar>

        {/* Botón de scroll hacia abajo */}
        {showScrollButton && (
          <IconButton
            onClick={scrollToBottom}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              boxShadow: 2,
              zIndex: 1,
            }}
            size="small"
          >
            <ArrowDownIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ flexShrink: 0 }} />

      {/* Message Input */}
      {chat.status !== 'closed' ? (
        <Paper sx={{ 
          p: 3, 
          borderRadius: '0 0 12px 12px',
          flexShrink: 0,
          zIndex: 1,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'white',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {user?.type === 'proveedor' && (
                <IconButton
                  color="primary"
                  onClick={() => setQuoteDialogOpen(true)}
                  title="Enviar cotización"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                >
                  <QuoteIcon />
                </IconButton>
              )}
              
              <IconButton 
                color="primary" 
                title="Adjuntar archivo"
                sx={{
                  bgcolor: 'grey.100',
                  '&:hover': {
                    bgcolor: 'grey.200',
                  }
                }}
              >
                <AttachFileIcon />
              </IconButton>
              
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500',
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ 
          p: 3, 
          borderRadius: '0 0 12px 12px', 
          bgcolor: 'grey.100',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              🔒 Esta conversación está cerrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No puedes enviar más mensajes en esta conversación
            </Typography>
            {chat.closeReason && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Motivo: {chat.closeReason}
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {/* Quotation Dialog */}
      <Dialog
        open={quoteDialogOpen}
        onClose={() => setQuoteDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Enviar Cotización</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Servicio"
                value={quotation.service}
                onChange={(e) => setQuotation(prev => ({ ...prev, service: e.target.value }))}
                required
              />
            </Grid>
            
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Descripción del proyecto"
                multiline
                rows={3}
                value={quotation.description}
                onChange={(e) => setQuotation(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Grid>
            
            <Grid xs={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={quotation.price}
                onChange={(e) => setQuotation(prev => ({ ...prev, price: Number(e.target.value) }))}
                required
              />
            </Grid>
            
            <Grid xs={6}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={quotation.currency}
                  onChange={(e) => setQuotation(prev => ({ ...prev, currency: e.target.value }))}
                  label="Moneda"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="MXN">MXN</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Términos y condiciones"
                multiline
                rows={2}
                value={quotation.terms}
                onChange={(e) => setQuotation(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Ej: Pago 50% al inicio, 50% al finalizar. Tiempo estimado: 4-6 semanas"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuoteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSendQuotation}
            variant="contained"
            disabled={!quotation.service || !quotation.description || !quotation.price}
          >
            Enviar Cotización
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu desplegable */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={handleOpenCloseDialog}>
          <ListItemIcon>
            <CloseIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Cerrar conversación" />
        </MenuItem>
      </Menu>

      {/* Diálogo de cierre de chat */}
      <CloseChatDialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
        onConfirm={handleCloseChat}
        providerName={otherUser.name}
      />

      {/* Diálogo de calificación */}
      <RatingDialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        onRate={handleRateProvider}
        providerName={otherUser.name}
        providerId={chat.proveedorId}
      />
    </Box>
  );
};

export default ChatInterface;
