import React from 'react';
import { Box, Pagination as MuiPagination, Stack } from '@mui/material';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
      <Stack spacing={2}>
        <MuiPagination 
          count={totalPages} 
          page={currentPage} 
          onChange={handlePageChange} 
          color="primary" 
          shape="rounded"
          variant="outlined"
          size="large"
          showFirstButton 
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 'bold',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderColor: '#3498db'
              }
            },
            '& .Mui-selected': {
              backgroundColor: '#3498db !important',
              color: 'white !important',
              boxShadow: '0 4px 10px rgba(52, 152, 219, 0.3)'
            }
          }}
        />
      </Stack>
    </Box>
  );
}