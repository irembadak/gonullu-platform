import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import EmergencyForm from "../components/EmergencyForm";
import MapPreview from "../components/MapPreview";
import { 
  Container, Typography, Box, Paper, Grid, 
  Alert, AlertTitle, Divider, Fade 
} from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MyLocationIcon from '@mui/icons-material/MyLocation';

export default function EmergencyPage() {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const [coordinates, setCoordinates] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMapClick = (lat, lng) => {
    const newLocation = { lat, lng };
    setCoordinates(newLocation);
    setSelectedLocation(newLocation); 
  };

  const handleSubmit = async (formData) => {
    if (!currentUser) {
      showNotification("Lütfen önce giriş yapın", "error");
      return;
    }

    if (!coordinates) {
      showNotification("Lütfen haritadan konum seçin", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await API.post("/emergencies", {
        ...formData,
        location: {
          lat: coordinates.lat,
          lng: coordinates.lng
        },
        reporter: currentUser.email
      });
      showNotification("Acil durum bildirimi başarıyla gönderildi!", "success");
      setCoordinates(null);
      setSelectedLocation(null);
    } catch (error) {
      showNotification(error.message || "Bildirim gönderilemedi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const locationString = coordinates
    ? `📍 Konum Seçildi: ${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`
    : "Lütfen Haritaya Tıklayarak Konum Seçin"; 

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#d32f2f', mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 50 }} />
              ACİL DURUM BİLDİR
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Hızlı yardım koordinasyonu için lütfen aşağıdaki formu eksiksiz doldurun.
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ mb: 4, borderRadius: 3 }}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>Önemli Uyarı</AlertTitle>
            Yanlış veya asılsız bildirimler, gerçek ihtiyaç sahiplerine ulaşılmasını engelleyebilir. Lütfen sadece gerçek acil durumları bildirin.
          </Alert>

          <Grid container spacing={4}>
            {/* Sol: Harita Seçimi */}
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 4, height: '100%', minHeight: 450 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MyLocationIcon color="primary" /> Konumunuzu İşaretleyin
                </Typography>
                <Box sx={{ height: 400, borderRadius: 3, overflow: 'hidden', border: '2px solid #f1f1f1' }}>
                  <MapPreview
                    onLocationSelect={handleMapClick}
                    initialCoordinates={coordinates}
                    showUserSelection={true}
                    userSelectedLocation={selectedLocation}
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 2, p: 1.5, bgcolor: coordinates ? '#e8f5e9' : '#fff3e0', color: coordinates ? '#2e7d32' : '#e65100', borderRadius: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  {locationString}
                </Typography>
              </Paper>
            </Grid>

            {/* Sağ: Bilgi Formu */}
            <Grid item xs={12} md={5}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Durum Detayları</Typography>
                <Divider sx={{ mb: 3 }} />
                <EmergencyForm
                  onSubmit={handleSubmit}
                  initialLocation={locationString} 
                  isSubmitting={isSubmitting}      
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
}