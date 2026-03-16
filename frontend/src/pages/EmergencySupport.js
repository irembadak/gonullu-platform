import React, { useState, useEffect } from 'react';
import API from '../services/api'; 
import { useAuth } from '../context/AuthContext'; 
import './EmergencySupport.css';
import { 
  Container, Typography, Grid, Card, CardContent, 
  Box, CircularProgress, Alert, Button, Chip, Divider, Fade 
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const EmergencyCard = ({ emergency }) => {
  return (
    <Card className="emergency-card-modern">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" className="emergency-type">
            <WarningAmberIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {emergency.emergencyType?.toUpperCase() || "ACİL DURUM"}
          </Typography>
          <Chip label="BEKLEYEN" color="error" size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: '#444' }}>
          "{emergency.description}"
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={1} sx={{ color: 'text.secondary', mb: 2 }}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#e74c3c' }} />
            <Typography variant="body2">
              <b>Konum:</b> {emergency.location?.lat?.toFixed(4)}, {emergency.location?.lng?.toFixed(4)}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon fontSize="small" sx={{ mr: 1, color: '#3498db' }} />
            <Typography variant="body2">
              <b>Kişi Sayısı:</b> {emergency.peopleCount} Kişi
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <b>Tarih:</b> {new Date(emergency.createdAt).toLocaleString('tr-TR')}
            </Typography>
          </Grid>
        </Grid>

        <Button 
          fullWidth 
          variant="contained" 
          color="error" 
          className="help-btn-pulse"
          onClick={() => alert('Yardım talebiniz koordinasyon birimine iletildi!')}
        >
          YARDIM ET
        </Button>
      </CardContent>
    </Card>
  );
};

const EmergencySupport = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmergencies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get('/emergencies');
        const data = response.data?.data || response.data || [];
        setEmergencies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Acil durumlar yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmergencies();
  }, []); 
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#c0392b', mb: 2 }}>
          ACİL DURUM DESTEĞİ
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Kriz anlarında hızlı koordinasyon. Aktif talepleri buradan takip edebilirsiniz.
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
          <CircularProgress color="error" size={60} />
          <Typography sx={{ mt: 2 }}>Kritik veriler yükleniyor...</Typography>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={3}>
            {emergencies.filter(em => em.status === 'pending').length > 0 ? (
              emergencies
                .filter(em => em.status === 'pending')
                .map(emergency => (
                  <Grid item xs={12} sm={6} md={4} key={emergency._id}>
                    <EmergencyCard emergency={emergency} />
                  </Grid>
                ))
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center', py: 10, bgcolor: '#fefefe', borderRadius: 4, border: '1px dashed #ccc' }}>
                <Typography variant="h6" color="textSecondary">
                  Harika! Şu an aktif bir acil durum talebi bulunmuyor.
                </Typography>
              </Box>
            )}
          </Grid>
        </Fade>
      )}
    </Container>
  );
};

export default EmergencySupport;