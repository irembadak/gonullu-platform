import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { eventService } from '../services/api'; 
import './ActivityCarousel.css';
import { 
  Box, Typography, Card, CardContent, Button, 
  Chip, Skeleton, Stack, Fade 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// KRİTİK DEĞİŞİKLİK: Home.js'den gelen 'events' prop'unu burada karşılıyoruz!
const ActivityCarousel = ({ events = [] }) => {
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext); 

  const handleJoin = async (eventId) => {
    try {
      if (!currentUser) {
        setError("Katılmak için giriş yapmalısınız.");
        return;
      }
      await eventService.join(eventId);
      alert("Etkinliğe başarıyla katıldınız!");
      // İsteğe bağlı: Ekranda anında 'Katıldınız' yazsın diye sayfayı yeniletebilir veya state'i güncelleyebilirsin
      window.location.reload(); 
    } catch (err) {
      setError(err || "Katılma işlemi başarısız oldu.");
    }
  };

  // Güvenlik kontrolü: Gelen events boşsa veya undefined ise
  const displayEvents = Array.isArray(events) ? events : [];

  return (
    <Box className="activity-carousel-wrapper">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>
          {/* Başlığı Home.js'de zaten yazdığımız için burayı silebilirsin ama kalması da sorun değil */}
        </Typography>
      </Box>

      {error && <Box sx={{ p: 2, mb: 2, color: 'error.main', textAlign: 'center', bgcolor: '#ffebee', borderRadius: 2 }}>{error}</Box>}

      <Box className="carousel-container-modern" sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
        {displayEvents.length > 0 ? (
          displayEvents.map((activity, index) => (
            <Fade in={true} timeout={index * 300 + 500} key={activity._id || index}>
              <Card className="modern-activity-card" sx={{ minWidth: 300, maxWidth: 350, flexShrink: 0, borderRadius: 4, boxShadow: 3 }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip label={activity.category || "Genel"} size="small" color="primary" sx={{ mb: 1, fontWeight: 'bold' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, height: 55, overflow: 'hidden' }}>
                      {activity.title || activity.name}
                    </Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: '#e74c3c' }} />
                      <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                         {/* Eğer adres string değilse veya yoksa varsayılan metin */}
                        {typeof activity.location?.address === 'string' ? activity.location.address : (typeof activity.location === 'string' ? activity.location : 'Konum Belirtilmedi')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: '#3498db' }} />
                      <Typography variant="body2">
                        {activity.startDate ? new Date(activity.startDate).toLocaleDateString('tr-TR') : 'Tarih Belirtilmedi'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <GroupsIcon sx={{ fontSize: 18, color: '#2ecc71' }} />
                      <Typography variant="body2">{activity.participants?.length || 0} Gönüllü</Typography>
                    </Box>
                  </Box>

                  <Button 
                    variant={activity.participants?.includes(currentUser?.id) ? "outlined" : "contained"}
                    fullWidth
                    onClick={() => handleJoin(activity._id)}
                    disabled={activity.participants?.includes(currentUser?.id)}
                    sx={{ mt: 3, borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                  >
                    {activity.participants?.includes(currentUser?.id) ? 'Katıldınız' : 'Etkinliğe Katıl'}
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          ))
        ) : (
          <Typography sx={{ width: '100%', textAlign: 'center', py: 5, color: 'text.secondary', fontStyle: 'italic' }}>
            Henüz gösterilecek etkinlik yok.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ActivityCarousel;