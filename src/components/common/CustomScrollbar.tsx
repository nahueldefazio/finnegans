import React, { forwardRef } from 'react';
import { Box, BoxProps } from '@mui/material';

interface CustomScrollbarProps extends BoxProps {
  children: React.ReactNode;
  scrollbarColor?: string;
  scrollbarTrackColor?: string;
  scrollbarThumbColor?: string;
  scrollbarThumbHoverColor?: string;
  scrollbarWidth?: string;
}

const CustomScrollbar = forwardRef<HTMLDivElement, CustomScrollbarProps>(({
  children,
  scrollbarColor = 'rgba(0,0,0,0.3)',
  scrollbarTrackColor = 'rgba(0,0,0,0.1)',
  scrollbarThumbColor = 'rgba(0,0,0,0.3)',
  scrollbarThumbHoverColor = 'rgba(0,0,0,0.5)',
  scrollbarWidth = '8px',
  sx,
  ...props
}, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        '&::-webkit-scrollbar': {
          width: scrollbarWidth,
        },
        '&::-webkit-scrollbar-track': {
          background: scrollbarTrackColor,
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: scrollbarThumbColor,
          borderRadius: '4px',
          '&:hover': {
            background: scrollbarThumbHoverColor,
          },
        },
        '&::-webkit-scrollbar-corner': {
          background: scrollbarTrackColor,
        },
        // Para Firefox
        scrollbarWidth: 'thin',
        scrollbarColor: `${scrollbarThumbColor} ${scrollbarTrackColor}`,
        // Mejorar la experiencia de scroll
        overflow: 'auto',
        scrollBehavior: 'smooth',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
});

export default CustomScrollbar;
