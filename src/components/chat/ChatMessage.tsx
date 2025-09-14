import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { ChatMessage as ChatMessageType, Quotation } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessageProps {
  message: ChatMessageType;
  onRespondToQuotation: (quotationId: string, status: 'accepted' | 'rejected') => void;
}

const QuotationCard: React.FC<{
  quotation: Quotation;
  onRespond: (status: 'accepted' | 'rejected') => void;
  isFromCurrentUser: boolean;
}> = ({ quotation, onRespond, isFromCurrentUser }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card sx={{ mt: 1, border: '2px solid', borderColor: 'primary.main' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          💰 Cotización
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom>
          {quotation.service}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {quotation.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" color="primary">
            ${quotation.price} {quotation.currency}
          </Typography>
          <Chip
            label={quotation.status === 'pending' ? 'Pendiente' : 
                   quotation.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
            color={quotation.status === 'pending' ? 'warning' : 
                   quotation.status === 'accepted' ? 'success' : 'error'}
            size="small"
          />
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Términos:</strong> {quotation.terms}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Válida hasta:</strong> {formatDate(quotation.validUntil)}
        </Typography>
        
        {!isFromCurrentUser && quotation.status === 'pending' && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircle />}
              onClick={() => onRespond('accepted')}
            >
              Aceptar
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Cancel />}
              onClick={() => onRespond('rejected')}
            >
              Rechazar
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRespondToQuotation }) => {
  const { user } = useAuth();
  const isFromCurrentUser = message.senderId === user?.id;
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isFromCurrentUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isFromCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          maxWidth: '70%',
        }}
      >
        <Avatar
          sx={{
            bgcolor: isFromCurrentUser ? 'primary.main' : 'secondary.main',
            mx: 1,
            width: 32,
            height: 32,
          }}
        >
          {isFromCurrentUser ? user?.name?.[0] : 'P'}
        </Avatar>
        
        <Box>
          <Paper
            sx={{
              p: 2,
              bgcolor: isFromCurrentUser ? 'primary.main' : 'grey.100',
              color: isFromCurrentUser ? 'white' : 'text.primary',
            }}
          >
            {message.type === 'text' && (
              <Typography variant="body1">{message.content}</Typography>
            )}
            
            {message.type === 'quotation' && message.quotation && (
              <QuotationCard
                quotation={message.quotation}
                onRespond={(status) => onRespondToQuotation(message.quotation!.id, status)}
                isFromCurrentUser={isFromCurrentUser}
              />
            )}
            
            {message.type === 'file' && (
              <Box>
                <Typography variant="body1" gutterBottom>
                  📎 Archivo adjunto
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {message.content}
                </Typography>
              </Box>
            )}
          </Paper>
          
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: isFromCurrentUser ? 'right' : 'left',
              mt: 0.5,
              px: 1,
            }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;

