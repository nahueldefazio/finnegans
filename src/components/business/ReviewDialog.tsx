import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Business } from '../../types';
import { createReview } from '../../services/businessService';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  business: Business | null;
  onReviewSubmitted: () => void;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onClose,
  business,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!business || !user) return;

    setLoading(true);
    try {
      const toUserId = user.id === business.pymeId ? business.proveedorId : business.pymeId;
      
      await createReview(
        user.id,
        toUserId,
        business.id,
        rating,
        comment
      );

      setSuccess(true);
      setTimeout(() => {
        onReviewSubmitted();
        onClose();
        setRating(5);
        setComment('');
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Error creating review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setRating(5);
    setComment('');
    setSuccess(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
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
          ⭐ Escribir Reseña
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {success ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Reseña enviada exitosamente! Redirigiendo a la sección de reseñas...
          </Alert>
        ) : (
          <>
            {business && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Proyecto #{business.id.slice(-6)}
                </Typography>
                <Typography variant="h6">
                  ${business.totalAmount} {business.currency}
                </Typography>
              </Box>
            )}
          </>
        )}

        {!success && (
          <>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Calificación
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue || 5)}
                  size="large"
                  sx={{
                    '& .MuiRating-icon': {
                      fontSize: '2.5rem',
                    },
                  }}
                />
              </Box>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {rating === 5 && '⭐ Excelente'}
                {rating === 4 && '👍 Muy bueno'}
                {rating === 3 && '👍 Bueno'}
                {rating === 2 && '👌 Regular'}
                {rating === 1 && '👎 Malo'}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Comentario"
              multiline
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia con este proyecto..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                },
              }}
            />
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{
              borderRadius: 2.5,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !comment.trim()}
            sx={{
              borderRadius: 2.5,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 140,
            }}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? 'Enviando...' : 'Enviar Reseña'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ReviewDialog;

