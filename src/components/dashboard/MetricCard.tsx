import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  const getGradient = (color: string) => {
    switch (color) {
      case 'primary':
        return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)';
      case 'success':
        return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
      case 'error':
        return 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
      default:
        return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    }
  };

  return (
    <Card 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: getGradient(color),
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              color="text.secondary" 
              gutterBottom 
              variant="body2"
              sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div"
              sx={{ 
                fontWeight: 700,
                background: getGradient(color),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: trend ? 1 : 0
              }}
            >
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                  sx={{ 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {trend.isPositive ? '↗' : '↘'} {trend.isPositive ? '+' : ''}{trend.value}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs mes anterior
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              background: getGradient(color),
              width: 64,
              height: 64,
              boxShadow: `0 8px 32px ${color === 'primary' ? 'rgba(99, 102, 241, 0.3)' : 
                         color === 'secondary' ? 'rgba(236, 72, 153, 0.3)' :
                         color === 'success' ? 'rgba(16, 185, 129, 0.3)' :
                         color === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
                         'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

