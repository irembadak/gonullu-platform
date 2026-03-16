import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import './TransportationSupport.css';
import { 
  CircularProgress, Container, Typography, Grid, Paper, 
  TextField, Button, Box, Tabs, Tab, Card, CardContent,
  Avatar, Divider, IconButton, Alert, Fade
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EastIcon from '@mui/icons-material/East';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const TransportCard = ({ item, currentUser, onDelete }) => {
  const isOwner = currentUser?._id === item.user?._id;
  const fromText = item.from?.address || item.fromLocation || 'Belirtilmedi';
  const toText = item.to?.address || item.toLocation || 'Belirtilmedi';

  return (
    <Card className={`transport-card-modern ${item.type}`}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: item.type === 'offer' ? '#3498db' : '#27ae60', width: 32, height: 32 }}>
              {item.type === 'offer' ? <DirectionsCarIcon fontSize="small"/> : <PersonSearchIcon fontSize="small"/>}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {item.user?.name || 'Gönüllü'}
            </Typography>
          </Box>
          {isOwner && (
            <IconButton size="small" onClick={() => onDelete(item._id)} color="error">
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </Box>

        <Box className="route-display" sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{fromText}</Typography>
          <EastIcon color="action" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{toText}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">Tarih / Saat</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {new Date(item.departureTime).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="textSecondary">
              {item.type === 'offer' ? 'Boş Koltuk' : 'Gereken Yer'}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.seats} Kişilik</Typography>
          </Grid>
        </Grid>

        {item.description && (
          <Typography variant="body2" sx={{ mt: 2, p: 1, bgcolor: '#f8f9fa', borderRadius: 1, fontStyle: 'italic' }}>
            "{item.description}"
          </Typography>
        )}

        {!isOwner && (
          <Button fullWidth variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
            İletişime Geç
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const TransportationSupport = () => {
  const [offers, setOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); 
  const { currentUser } = useAuth();

  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'offer',
    fromLocation: '',
    toLocation: '',
    departureTime: '',
    seats: 1,
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offersRes, requestsRes] = await Promise.all([
        API.get('/transport/offers'),
        API.get('/transport/requests')
      ]);
      setOffers(offersRes.data || []);
      setRequests(requestsRes.data || []);
    } catch (err) {
      setError('Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const payload = {
      type: formData.type,
      from: {
        address: formData.fromLocation,
        location: { type: 'Point', coordinates: [27.1428, 38.4237] } 
      },
      to: {
        address: formData.toLocation,
        location: { type: 'Point', coordinates: [27.1428, 38.4237] }
      },
      departureTime: formData.departureTime,
      seats: Number(formData.seats),
      description: formData.description
    };

    try {
      await API.post('/transport', payload);
      setFormData({ type: formData.type, fromLocation: '', toLocation: '', departureTime: '', seats: 1, description: '' });
      fetchData();
      alert("İlan başarıyla oluşturuldu!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Bilinmeyen bir hata oluştu.";
      console.error("Ulaşım Form Hatası Detayı:", err.response || err);
      alert(`Hata: ${errorMessage}`);
    } finally { 
      setFormLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Emin misiniz?')) return;
    try {
      await API.delete(`/transport/${id}`);
      fetchData();
    } catch (err) { alert("Silinemedi."); }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800, mb: 6, color: '#2c3e50' }}>
        Ulaşım Desteği
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Yeni İlan Oluştur</Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button 
                  fullWidth 
                  variant={formData.type === 'offer' ? 'contained' : 'outlined'}
                  onClick={() => setFormData({...formData, type: 'offer'})}
                  size="small"
                >Aracım Var</Button>
                <Button 
                  fullWidth 
                  variant={formData.type === 'request' ? 'contained' : 'outlined'}
                  onClick={() => setFormData({...formData, type: 'request'})}
                  size="small"
                  color="success"
                >Araç Lazım</Button>
              </Box>

              <TextField fullWidth label="Nereden" name="fromLocation" value={formData.fromLocation} onChange={(e) => setFormData({...formData, fromLocation: e.target.value})} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Nereye" name="toLocation" value={formData.toLocation} onChange={(e) => setFormData({...formData, toLocation: e.target.value})} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Tarih" type="datetime-local" name="departureTime" value={formData.departureTime} onChange={(e) => setFormData({...formData, departureTime: e.target.value})} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} required />
              <TextField fullWidth label="Kişi Sayısı" type="number" name="seats" value={formData.seats} onChange={(e) => setFormData({...formData, seats: e.target.value})} sx={{ mb: 2 }} required min="1" />
              <TextField fullWidth label="Notlar" name="description" multiline rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} sx={{ mb: 3 }} />
              
              <Button fullWidth variant="contained" type="submit" disabled={formLoading} size="large" sx={{ borderRadius: 2 }}>
                {formLoading ? <CircularProgress size={24} /> : 'İlanı Yayınla'}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)} variant="fullWidth">
              <Tab label={`Teklifler (${offers.length})`} />
              <Tab label={`Talepler (${requests.length})`} />
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Box>
          ) : (
            <Fade in={true}>
              <Grid container spacing={2}>
                {(tabValue === 0 ? offers : requests).map(item => (
                  <Grid item xs={12} sm={6} key={item._id}>
                    <TransportCard item={item} currentUser={currentUser} onDelete={handleDelete} />
                  </Grid>
                ))}
              </Grid>
            </Fade>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransportationSupport;