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

      onReviewSubmitted();
      onClose();
      setRating(5);
      setComment('');
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
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Escribir Reseña
      </DialogTitle>
      
      <DialogContent>
        {business && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Proyecto #{business.id.slice(-6)}
            </Typography>
            <Typography variant="h6">
              ${business.totalAmount} {business.currency}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Calificación
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue || 5)}
            size="large"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {rating === 5 && 'Excelente'}
            {rating === 4 && 'Muy bueno'}
            {rating === 3 && 'Bueno'}
            {rating === 2 && 'Regular'}
            {rating === 1 && 'Malo'}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Comentario"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia con este proyecto..."
          variant="outlined"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !comment.trim()}
        >
          {loading ? 'Enviando...' : 'Enviar Reseña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;

