import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import './LoadingSpinner.css'; 

export default function LoadingSpinner({ message = "Yükleniyor..." }) {
  return (
    <Fade in={true} timeout={600}>
      <Box className="spinner-wrapper">
        <Box className="spinner-visual">
          {/* Arka planda sabit gri bir halka, üstte dönen mavi halka */}
          <CircularProgress
            variant="determinate"
            sx={{ color: '#eef2f6' }}
            size={60}
            thickness={4}
            value={100}
          />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            sx={{
              color: '#3498db',
              animationDuration: '600ms',
              position: 'absolute',
              left: 0,
            }}
            size={60}
            thickness={4}
          />
          {/* Tam ortada yardımlaşma ikonu */}
          <VolunteerActivismIcon 
            sx={{ 
              position: 'absolute', 
              fontSize: 25, 
              color: '#3498db',
              animation: 'pulse 1.5s infinite' 
            }} 
          />
        </Box>
        <Typography variant="body1" className="loading-text-modern">
          {message}
        </Typography>
      </Box>
    </Fade>
  );
}