import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { 
  Container, Typography, Grid, Card, CardContent, 
  Box, Button, Chip, Divider, Avatar, Badge, Fade, CircularProgress 
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventDetailModal from "../components/EventDetailModal";
import "./AdminDashboard.css"; 

export default function AdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchPendingEvents = async () => {
      try {
        const response = await API.get(`/events/pending`);
        const data = response.data || response;
        setPendingEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Etkinlikler yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingEvents();
  }, [currentUser, navigate]);

  const handleEventAction = async (id, action) => {
    try {
      await API.post(`/events/${id}/${action}`);
      setPendingEvents(prev => prev.filter(e => e._id !== id));
      alert(`Etkinlik ${action === 'approve' ? 'onaylandı' : 'reddedildi'}.`);
    } catch (err) {
      alert("İşlem başarısız.");
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Panel yükleniyor...</Typography>
    </Box>
  );

  return (
    <Container maxWidth="xl" className="admin-dashboard">
      <Fade in={true} timeout={800}>
        <Box>
          <Box className="dashboard-header" sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>Admin Paneli</Typography>
            <Typography variant="h6" color="textSecondary">Sistem Yönetimi ve Onay Merkezi</Typography>
          </Box>

          {/* İstatistik Kartları  */}
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Bekleyen Onaylar</h4>
              <div className="stat-value">{pendingEvents.length}</div>
            </div>
            <div className="stat-card green">
              <h4>Sistem Durumu</h4>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>AKTİF</div>
            </div>
            <div className="stat-card red">
              <h4>Kritik Uyarılar</h4>
              <div className="stat-value">0</div>
            </div>
          </div>

          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PendingActionsIcon color="primary" /> Onay Bekleyen Etkinlikler
          </Typography>

          {pendingEvents.length === 0 ? (
            <div className="no-events">
              <p>Şu anda onay bekleyen yeni bir etkinlik başvurusu bulunmamaktadır.</p>
            </div>
          ) : (
            <Grid container spacing={3} className="events-grid">
              {pendingEvents.map(event => (
                <Grid item xs={12} md={6} lg={4} key={event._id}>
                  <Card className="event-card">
                    <CardContent className="event-content">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{event.name || event.title}</Typography>
                        <Chip label="BEKLEMEDE" size="small" color="warning" />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 3, height: 40, overflow: 'hidden' }}>
                        {event.description}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Box className="event-meta">
                        <Typography variant="caption" display="block">
                          <strong>Organizatör:</strong> {event.organizer?.name || 'Bilinmiyor'}
                        </Typography>
                        <Typography variant="caption" display="block">
                          <strong>Tarih:</strong> {new Date(event.date || event.startDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>

                    <Box className="event-actions" sx={{ p: 2, bgcolor: '#f8fafc' }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleEventAction(event._id, 'approve')}
                      > Onayla </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="error" 
                        startIcon={<CancelIcon />}
                        onClick={() => handleEventAction(event._id, 'reject')}
                      > Reddet </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<InfoIcon />}
                        onClick={() => setSelectedEvent(event)}
                      > Detay </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {selectedEvent && (
            <EventDetailModal 
              isOpen={!!selectedEvent}
              onClose={() => setSelectedEvent(null)}
              event={selectedEvent}
            />
          )}
        </Box>
      </Fade>
    </Container>
  );
}