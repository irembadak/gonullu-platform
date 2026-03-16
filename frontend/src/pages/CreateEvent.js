import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import MapPreview from "../components/MapPreview";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button, Grid, Box, Alert, Divider, Autocomplete, Chip } from "@mui/material";

const categories = ['Çevre', 'Eğitim', 'Sağlık', 'Hayvan Hakları', 'Teknoloji', 'Sosyal Yardım'];
const commonSkills = ['İlk Yardım', 'Organizasyon', 'Saha Çalışması', 'Lojistik', 'Dijital Destek'];

export default function CreateEvent() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    name: "",
    description: "",
    date: "",
    category: "",
    requiredSkills: [],
    lat: null,
    lng: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLocationSelect = (lat, lng) => {
    setEvent(prev => ({ ...prev, lat, lng }));
    setError(""); // Konum seçilince hatayı temizle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event.lat || !event.lng) return setError("Lütfen haritadan yer seçin.");
    
    setIsLoading(true);
    setError("");

    // İsteğin asılı kalmaması için bir Controller oluşturuyoruz
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 saniye sınır

    try {
      const payload = {
        title: event.name,
        description: event.description,
        startDate: event.date,
        category: event.category,
        requiredSkills: event.requiredSkills,
        location: {
          type: 'Point',
          coordinates: [parseFloat(event.lng), parseFloat(event.lat)]
        }
      };

      const response = await api.post("/events", payload, { signal: controller.signal });
      
      clearTimeout(timeoutId);
      setSuccess("Etkinlik başarıyla oluşturuldu! Onay sürecine alındı.");
      setTimeout(() => navigate("/activities"), 2000);
      
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError("Sunucu çok geç yanıt verdi. Lütfen internetinizi veya sunucunuzu kontrol edin.");
      } else {
        setError(err.response?.data?.message || "Etkinlik kaydedilirken bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>Etkinlik Paylaş</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Etkinlik Başlığı" value={event.name} onChange={(e) => setEvent({...event, name: e.target.value})} required sx={{ mb: 2 }} />
              <Autocomplete
                options={categories}
                onChange={(e, val) => setEvent({...event, category: val})}
                renderInput={(params) => <TextField {...params} label="Kategori" required sx={{ mb: 2 }} />}
              />
              <Autocomplete
                multiple
                options={commonSkills}
                onChange={(e, val) => setEvent({...event, requiredSkills: val})}
                renderInput={(params) => <TextField {...params} label="Gereken Beceriler" sx={{ mb: 2 }} />}
                renderTags={(value, getTagProps) => value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} color="primary" variant="outlined" />
                ))}
              />
              <TextField fullWidth label="Açıklama" multiline rows={4} value={event.description} onChange={(e) => setEvent({...event, description: e.target.value})} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="datetime-local" label="Etkinlik Zamanı" InputLabelProps={{ shrink: true }} value={event.date} onChange={(e) => setEvent({...event, date: e.target.value})} required sx={{ mb: 2 }} />
              <Box sx={{ height: 350, border: '1px solid #ddd', borderRadius: 2, overflow: 'hidden' }}>
                <MapPreview onLocationSelect={handleLocationSelect} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}>
                {isLoading ? "İşleniyor..." : "Etkinliği Yayınla"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}