import React from 'react';
import { Alert, AlertTitle, Box, Fade } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ErrorMessage({ message, title = "Bir Hata Oluştu" }) {
  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ my: 3, width: '100%' }}>
        <Alert 
          severity="error" 
          variant="filled" 
          icon={<ErrorOutlineIcon fontSize="inherit" />}
          sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold' }}>{title}</AlertTitle>
          {message || 'Beklenmedik bir sorunla karşılaşıldı. Lütfen daha sonra tekrar deneyin.'}
        </Alert>
      </Box>
    </Fade>
  );
}