import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Rating,
  TextField,
  Avatar,
  Grid,
  Chip,
} from '@mui/material';
import { Star as StarIcon, Close as CloseIcon } from '@mui/icons-material';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onRate: (rating: number, comment: string) => void;
  providerName: string;
  providerId: string;
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  onRate,
  providerName,
  providerId,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState<number>(-1);

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating, comment);
      setRating(0);
      setComment('');
      onClose();
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  const getRatingText = (value: number) => {
    const labels: { [key: number]: string } = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente',
    };
    return labels[value] || '';
  };

  const getRatingColor = (value: number) => {
    if (value >= 4) return 'success';
    if (value >= 3) return 'warning';
    return 'error';
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
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              width: 48,
              height: 48,
            }}
          >
            <StarIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Calificar Experiencia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              con {providerName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            ¿Cómo calificarías tu experiencia con este proveedor?
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating
              name="provider-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue || 0);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: rating >= 4 ? '#10b981' : rating >= 3 ? '#f59e0b' : '#ef4444',
                },
                '& .MuiRating-iconHover': {
                  color: (hover || rating) >= 4 ? '#10b981' : (hover || rating) >= 3 ? '#f59e0b' : '#ef4444',
                },
              }}
            />
            {rating > 0 && (
              <Chip
                label={getRatingText(rating)}
                color={getRatingColor(rating) as any}
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Comentario (opcional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Comparte tu experiencia con este proveedor..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            💡 Tu calificación ayudará a otros usuarios a tomar mejores decisiones
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Las calificaciones son públicas y se mostrarán en el perfil del proveedor
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{ minWidth: 120 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={rating === 0}
          startIcon={<StarIcon />}
          sx={{ 
            minWidth: 120,
            background: rating >= 4 ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' :
                       rating >= 3 ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' :
                       'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
            '&:hover': {
              background: rating >= 4 ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' :
                         rating >= 3 ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' :
                         'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            },
          }}
        >
          Enviar Calificación
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;
