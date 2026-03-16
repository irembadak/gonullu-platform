import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  IconButton, 
  Divider, 
  Grid,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import DescriptionIcon from '@mui/icons-material/Description';

export default function EventDetailModal({ isOpen, onClose, event }) {
  if (!event) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>
          {event.name || event.title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Chip 
            label={event.status === 'pending' ? 'Onay Bekliyor' : 'Onaylandı'} 
            color={event.status === 'pending' ? 'warning' : 'success'}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DescriptionIcon color="action" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Açıklama</Typography>
                <Typography variant="body1">{event.description}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <EventIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Tarih</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {new Date(event.date || event.startDate).toLocaleString('tr-TR')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <GroupsIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Katılımcı Sayısı</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {event.participants?.length || 0} Gönüllü
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocationOnIcon color="error" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Konum Bilgisi</Typography>
                <Typography variant="body2">{event.location?.address || event.location || "Belirtilmemiş"}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <PersonIcon color="action" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Organizatör</Typography>
                <Typography variant="body2">{event.organizer?.name || "Bilinmeyen Kullanıcı"}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          fullWidth 
          variant="contained" 
          sx={{ 
            borderRadius: 2, 
            bgcolor: '#2c3e50', 
            '&:hover': { bgcolor: '#1a252f' } 
          }}
        >
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
}