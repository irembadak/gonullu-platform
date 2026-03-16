import React, { useEffect, useState } from "react";
import API from "../services/api"; // Standart API köprümüz (Interceptor ile token'ı kendi ekler)
import { useAuth } from "../context/AuthContext";
import { eventService } from "../services/api"; // Katılma işlemi için
import { 
  CircularProgress, 
  Container, 
  Typography, 
  Card, 
  Grid, 
  Box, 
  Alert,
  Chip,
  Fade
} from "@mui/material"; 
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; 
import './Recommend.css'; 

export default function Recommend() {
  const { currentUser, loading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null); // Veri AI'dan mı geldi, Fallback'ten mi?

  useEffect(() => {
    const fetchRecommendationsFromLiveLocation = () => {
      if (!navigator.geolocation) {
        setError("Tarayıcınız konum servisini desteklemiyor.");
        setLoading(false);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // KRİTİK DÜZELTME: Backend'in beklediği tam adrese POST atıyoruz
            const res = await API.post("/ai/recommend", { 
              lat: latitude, 
              lng: longitude,
              userId: currentUser?._id || currentUser?.id // Backend istiyor olabilir
            });
            
            const data = res.data || res;
            
            // KRİTİK DÜZELTME 2: Backend veriyi 'recommendations' objesi içinde yolluyor!
            if (data.success && data.recommendations) {
              setRecommendations(data.recommendations);
              setSource(data.source); // 'ai' veya 'fallback'
            } else {
              setRecommendations([]);
            }

          } catch (err) {
            console.error("AI Fetch Error:", err);
            setError("Öneriler alınırken sunucuyla bağlantı kurulamadı.");
          } finally {
            setLoading(false);
          }
        },
        (locationError) => {
          setError("Yakınınızdaki etkinlikleri göstermek için tarayıcıda konum izni gereklidir.");
          setLoading(false);
        }
      );
    };

    if (!authLoading && currentUser) {
      fetchRecommendationsFromLiveLocation();
    } else if (!authLoading && !currentUser) {
        setError("AI önerilerini görmek için lütfen giriş yapın.");
        setLoading(false);
    }
  }, [authLoading, currentUser]); 

  const handleJoin = async (eventId) => {
    if(!eventId) {
      alert("Bu etkinlik (Fallback) şu an test amaçlıdır, direkt katılım yapılamaz.");
      return;
    }
    try {
      await eventService.join(eventId);
      alert('Katılım isteği başarıyla gönderildi!');
    } catch (err) {
      alert(err || 'Katılım işlemi sırasında bir hata oluştu.');
    }
  };

  if (authLoading || loading) {
    return (
      <Box className="loading-box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#3498db' }} />
        <Typography sx={{ mt: 3, fontWeight: '500', color: '#34495e' }}>
          Yapay zeka size en uygun etkinlikleri analiz ediyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="md" className="recommend-container" sx={{ py: 5 }}>
        <Box className="recommend-header" sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <AutoAwesomeIcon sx={{ color: '#3498db' }} />
            Sizin İçin AI Önerileri
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            Konumunuza en yakın ve ilgi alanlarınıza en uygun gönüllülük faaliyetleri.
          </Typography>
          {/* Fallback (B Planı) devredeyse küçük bir uyarı */}
          {source === 'fallback' && (
            <Chip label="Çevrimdışı / Alternatif Öneriler" color="warning" size="small" sx={{ mt: 2 }} />
          )}
        </Box>
        
        {error && <Alert severity="info" sx={{ mb: 4, borderRadius: '10px' }}>{error}</Alert>}

        {recommendations.length === 0 && !error ? (
          <Card className="ai-card" sx={{ display: 'flex', justifyContent: 'center', py: 8, bgcolor: '#f8fafc', boxShadow: 'none', border: '1px dashed #cbd5e1' }}>
            <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
              Şu anda bu konumda aktif bir gönüllülük faaliyeti bulunmuyor.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {recommendations.map((rec, i) => (
              <Grid item xs={12} key={rec._id || i}>
                <Card className="ai-card" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderRadius: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                  <Box className="ai-card-info" sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#2c3e50', mb: 1 }}>
                      {rec.name || rec.title || "İsimsiz Etkinlik"}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {rec.description}
                    </Typography>

                    <Box className="ai-card-meta" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <LocationOnIcon fontSize="small" sx={{ color: '#e74c3c' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                         Mesafe: {rec.distance ? `${rec.distance} km` : 'Hesaplanamadı'}
                      </Typography>
                      {rec.category && (
                        <Chip 
                          label={rec.category} 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                          sx={{ ml: 2, fontSize: '0.7rem', fontWeight: 'bold' }} 
                        />
                      )}
                    </Box>
                  </Box>
                  <button 
                    className="btn-join" 
                    onClick={() => handleJoin(rec._id)}
                    style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#3498db', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', marginLeft: '15px' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                  >
                    Katıl
                  </button>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Fade>
  );
}