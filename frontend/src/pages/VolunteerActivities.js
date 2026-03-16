import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom'; 
import API from "../services/api";
import "./VolunteerActivities.css";
import { 
  Container, Grid, Card, CardContent, Typography, TextField, 
  InputAdornment, MenuItem, Box, Chip, Skeleton, Button, Fade,
  Paper, Divider 
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';

const VolunteerActivities = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Hepsi");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get("/events");
        
        let rawData = [];
        if (Array.isArray(response)) {
            rawData = response;
        } else if (response && Array.isArray(response.data)) {
            rawData = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
            rawData = response.data.data;
        }

        setEvents(rawData);
        setFilteredEvents(rawData);
      } catch (err) {
        console.error("Etkinlik getirme hatası:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const eventName = event.title || event.name || "İsimsiz Etkinlik";
      const matchesSearch = eventName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "Hepsi" || event.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, categoryFilter, events]);
  const handleJoinEvent = async (eventId) => {
    if (!currentUser) {
      alert("Etkinliğe katılmak için önce giriş yapmalısınız!");
      return;
    }

    try {
      await API.post(`/events/${eventId}/join`);
      alert("Etkinliğe başarıyla katıldınız! Teşekkür ederiz.");
    } catch (err) {
      console.error("Katılma hatası:", err);
      alert(err || "Bu etkinliğe katılırken bir sorun oluştu.");
    }
  };

  return (
    <Container maxWidth="lg" className="volunteer-activities-page" sx={{ py: 5 }}>
      <Box className="activities-header" sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', mb: 1 }}>Gönüllü Faaliyetler</Typography>
        <Typography variant="h6" color="textSecondary">Topluma değer katan etkinlikleri keşfedin ve katılın.</Typography>
      </Box>

      {/* Arama ve Filtreleme Bölümü */}
      <Paper elevation={0} sx={{ p: 3, mb: 5, borderRadius: 4, bgcolor: '#f8f9fa' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Etkinlik adına göre ara..."
              variant="outlined"
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Kategori Seçin"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            >
              <MenuItem value="Hepsi">Tüm Kategoriler</MenuItem>
              <MenuItem value="Çevre">Çevre</MenuItem>
              <MenuItem value="Eğitim">Eğitim</MenuItem>
              <MenuItem value="Hayvan Hakları">Hayvan Hakları</MenuItem>
              <MenuItem value="Sosyal Yardım">Sosyal Yardım</MenuItem>
              <MenuItem value="Sağlık">Sağlık</MenuItem>
              <MenuItem value="Teknoloji">Teknoloji</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Etkinlik Listesi Alanı */}
      {isLoading ? (
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={4}>
            {filteredEvents.length === 0 ? (
              <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                <Typography variant="h5" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                  Henüz bir etkinlik bulunamadı.
                </Typography>
              </Box>
            ) : (
              filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 4, 
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 }
                  }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Chip 
                        label={event.category || "Genel"} 
                        color="primary" 
                        size="small" 
                        sx={{ mb: 2, fontWeight: 'bold', borderRadius: 1 }} 
                      />
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#2c3e50' }}>
                        {event.title || event.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        sx={{ 
                          mb: 3, 
                          height: 60,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {event.description}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventIcon sx={{ fontSize: 20, mr: 1, color: '#3498db' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {event.startDate ? new Date(event.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Belirtilmedi'}
                        </Typography>
                      </Box>
                      
                      <Typography variant="caption" color="textSecondary">
                        Düzenleyen: <strong>{event.organization?.name || 'STK Yetkilisi'}</strong>
                      </Typography>
                      
                    <Button 
                     fullWidth 
                     variant="contained" 
                     onClick={() => navigate(`/activity/${event._id}`)} 
                     sx={{ mt: 3, borderRadius: 2, py: 1.2, textTransform: 'none', fontWeight: 'bold', boxShadow: 'none' }}
          >
                     Detayları Gör & Katıl
                    </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Fade>
      )}
    </Container>
  );
};

export default VolunteerActivities;