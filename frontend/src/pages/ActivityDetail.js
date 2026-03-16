import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, Typography, Box, Paper, Grid, Chip, 
  Button, CircularProgress, Divider, Alert 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ActivityDetail = () => {
  const { id } = useParams(); // URL'den etkinlik ID'sini alır
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await eventService.getById(id);
        
        // Kurşun geçirmez veri yakalayıcı
        let data = response;
        if (response && response.data) data = response.data;
        if (data && data.data) data = data.data;

        setEvent(data);
      } catch (err) {
        setError("Etkinlik detayları alınırken bir hata oluştu.");
        console.error("Detay getirme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const handleJoin = async () => {
    if (!currentUser) {
      alert("Etkinliğe katılmak için lütfen önce giriş yapın.");
      return;
    }
    try {
      await eventService.join(id);
      alert("Etkinliğe başarıyla katıldınız! Teşekkür ederiz.");
      // Katıldıktan sonra sayfayı yenileyerek butonu güncelliyoruz
      window.location.reload(); 
    } catch (err) {
      alert(err || "Bu etkinliğe katılırken bir sorun oluştu.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container sx={{ py: 5, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error || "Etkinlik bulunamadı."}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined">
          Geri Dön
        </Button>
      </Container>
    );
  }

  const isParticipating = event.participants?.includes(currentUser?._id || currentUser?.id);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3, color: 'text.secondary', textTransform: 'none' }}
      >
        Listeye Geri Dön
      </Button>

      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Chip 
          label={event.category || "Genel"} 
          color="primary" 
          sx={{ mb: 2, fontWeight: 'bold' }} 
        />
        
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', mb: 3 }}>
          {event.title || event.name}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CalendarMonthIcon color="primary" />
              <Typography variant="body1">
                {event.startDate ? new Date(event.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Belirtilmedi'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <LocationOnIcon color="error" />
              <Typography variant="body1">
                {typeof event.location?.address === 'string' ? event.location.address : (typeof event.location === 'string' ? event.location : 'Konum Belirtilmedi')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <GroupsIcon color="success" />
              <Typography variant="body1">
                {event.participants?.length || 0} Gönüllü
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Etkinlik Hakkında</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 4, whiteSpace: 'pre-line' }}>
          {event.description || "Bu etkinlik için detaylı bir açıklama girilmemiştir."}
        </Typography>

        {event.organization && (
          <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, mb: 4 }}>
            <Typography variant="subtitle2" color="textSecondary">Düzenleyen Organizasyon / Kişi:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e' }}>
              {event.organization?.name || 'STK Yetkilisi'}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant={isParticipating ? "outlined" : "contained"} 
            size="large"
            disabled={isParticipating}
            onClick={handleJoin}
            sx={{ 
              px: 6, py: 1.5, 
              borderRadius: 3, 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: isParticipating ? 'none' : 4
            }}
          >
            {isParticipating ? "Bu Etkinliğe Kayıtlısınız" : "Gönüllü Olarak Katıl"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ActivityDetail;