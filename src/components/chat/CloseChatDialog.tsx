import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Archive as ArchiveIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from '@mui/icons-material';

interface CloseChatDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, comment: string, shouldRate: boolean) => void;
  providerName: string;
}

const CloseChatDialog: React.FC<CloseChatDialogProps> = ({
  open,
  onClose,
  onConfirm,
  providerName,
}) => {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [shouldRate, setShouldRate] = useState(false);

  const handleSubmit = () => {
    if (reason) {
      onConfirm(reason, comment, shouldRate);
      setReason('');
      setComment('');
      setShouldRate(false);
      onClose();
    }
  };

  const handleClose = () => {
    setReason('');
    setComment('');
    setShouldRate(false);
    onClose();
  };

  const getReasonIcon = (reasonValue: string) => {
    switch (reasonValue) {
      case 'satisfactorio':
        return <ThumbUpIcon color="success" />;
      case 'insatisfactorio':
        return <ThumbDownIcon color="error" />;
      case 'completado':
        return <ArchiveIcon color="info" />;
      default:
        return <DeleteIcon color="action" />;
    }
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
          animation: 'dialogSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes dialogSlideIn': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.9) translateY(-20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1) translateY(0)',
            },
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
              width: 48,
              height: 48,
            }}
          >
            <DeleteIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Cerrar Conversación
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
            ¿Por qué quieres cerrar esta conversación?
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Motivo del cierre</InputLabel>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              label="Motivo del cierre"
            >
              <MenuItem value="satisfactorio">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThumbUpIcon color="success" />
                  <Typography>Experiencia satisfactoria - Proyecto completado</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="insatisfactorio">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThumbDownIcon color="error" />
                  <Typography>Experiencia insatisfactoria</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="completado">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ArchiveIcon color="info" />
                  <Typography>Proyecto completado sin problemas</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="cancelado">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DeleteIcon color="action" />
                  <Typography>Proyecto cancelado</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="otro">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DeleteIcon color="action" />
                  <Typography>Otro motivo</Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {reason && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Comentario adicional (opcional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Proporciona más detalles sobre el motivo del cierre..."
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
          )}

          {(reason === 'satisfactorio' || reason === 'completado') && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                ¿Te gustaría calificar la experiencia?
              </Typography>
              <RadioGroup
                value={shouldRate}
                onChange={(e) => setShouldRate(e.target.value === 'true')}
                row
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Sí, quiero calificar"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="No, gracias"
                />
              </RadioGroup>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'warning.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'warning.200',
          }}
        >
          <Typography variant="body2" color="warning.dark" sx={{ mb: 1 }}>
            ⚠️ Esta acción cerrará permanentemente la conversación
          </Typography>
          <Typography variant="caption" color="warning.dark">
            No podrás enviar más mensajes en este chat, pero podrás ver el historial
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!reason}
          startIcon={reason ? getReasonIcon(reason) : <DeleteIcon />}
          sx={{ 
            minWidth: 120,
            background: reason === 'satisfactorio' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' :
                       reason === 'insatisfactorio' ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' :
                       'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
            '&:hover': {
              background: reason === 'satisfactorio' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' :
                         reason === 'insatisfactorio' ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' :
                         'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
            },
          }}
        >
          Cerrar Chat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseChatDialog;
