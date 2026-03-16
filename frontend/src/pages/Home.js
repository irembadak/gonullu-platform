import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import MapPreview from '../components/MapPreview';
import ActivityCarousel from '../components/ActivityCarousel';
import Recommend from './Recommend'; // AI ÖNERİLERİ KÖPRÜSÜ EKLENDİ!
import { eventService } from '../services/api'; 
import { Container, Grid, Typography, Button, Box, Skeleton, Alert } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // KRİTİK DÜZELTME: getEvents() değil, api.js'deki doğru isim olan getAll() kullanıldı.
        const res = await eventService.getAll(); 
        
        // KURŞUN GEÇİRMEZ VERİ YAKALAYICI
        let rawData = [];
        if (Array.isArray(res)) {
            rawData = res;
        } else if (res && Array.isArray(res.data)) {
            rawData = res.data;
        } else if (res && res.data && Array.isArray(res.data.data)) {
            rawData = res.data.data;
        }

        console.log("Ana Sayfa Çekilen Etkinlikler:", rawData);
        setEvents(rawData);
      } catch (err) {
        console.error('Etkinlikler alınamadı:', err);
        setError("Etkinlikler şu an yüklenemiyor, lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="home">
      {/* Hero Section - Profesyonel Karşılama */}
      <section className="hero-section">
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Topluma Katkıda Bulunun
          </Typography>
          <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
            Yapay zeka destekli gönüllü organizasyon platformu ile dünyayı birlikte değiştirelim.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            className="cta-button" 
            onClick={() => navigate('/activities')}
            sx={{ 
              mt: 2, 
              borderRadius: '30px', 
              px: 5, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Hemen Katıl
          </Button>
        </Container>
      </section>

      {/* Özellikler - Feature Cards */}
      <Container sx={{ mt: -5, mb: 8 }}>
        <Grid container spacing={3}>
          {[
            { 
              title: "AI Önerileri", 
              desc: "İlgi alanlarınıza özel faaliyetler", 
              icon: <AutoAwesomeIcon sx={{ fontSize: 40, mb: 1 }} color="primary" /> 
            },
            { 
              title: "Acil Destek", 
              desc: "Kriz anlarında hızlı koordinasyon", 
              icon: <CrisisAlertIcon sx={{ fontSize: 40, mb: 1, color: '#e74c3c' }} /> 
            },
            { 
              title: "Konum Bazlı", 
              desc: "Çevrenizdeki fırsatları keşfedin", 
              icon: <LocationOnIcon sx={{ fontSize: 40, mb: 1, color: '#2ecc71' }} /> 
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <div className="feature-card">
                {feature.icon}
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.desc}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- YENİ EKLENEN AI ÖNERİLERİ BÖLÜMÜ --- */}
      <Recommend />

      {/* Harita Bölümü */}
      <Container sx={{ mb: 8, mt: 5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: '700', color: '#2c3e50' }}>
            Yakınınızdaki Gönüllü Faaliyetler
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Harita üzerinden size en yakın etkinlikleri anlık olarak takip edin.
          </Typography>
        </Box>
        <div className="map-container-styled" style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          {loading ? (
            <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
          ) : (
            <MapPreview events={events} />
          )}
        </div>
      </Container>

      {/* Aktiviteler Bölümü (Popüler) */}
      <Container sx={{ mb: 10 }}>
        <Typography variant="h4" sx={{ fontWeight: '700', mb: 4, color: '#2c3e50' }}>
          Popüler Gönüllü Faaliyetler
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}
        
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((n) => (
              <Grid item xs={12} md={4} key={n}>
                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: '15px' }} />
                <Box sx={{ pt: 1 }}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : events.length > 0 ? (
          <ActivityCarousel events={events} />
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            bgcolor: '#f8fafc', 
            borderRadius: '15px',
            border: '2px dashed #e2e8f0'
          }}>
            <Typography variant="h6" color="textSecondary">
              Henüz aktif bir etkinlik bulunmuyor.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Yeni etkinlikler eklendiğinde burada görünecektir.
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default Home;