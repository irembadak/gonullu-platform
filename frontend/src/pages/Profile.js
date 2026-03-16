import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './Profile.css';
import { 
  CircularProgress, Container, Paper, Typography, Box, 
  Avatar, Grid, Button, TextField, Chip, Divider, Alert, Fade 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import UpgradeIcon from '@mui/icons-material/Upgrade'; 
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const Profile = () => {
  const { currentUser, logout, updateAuthUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    skills: '', 
    interests: '',
    city: '',
    district: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        skills: Array.isArray(currentUser.skills) ? currentUser.skills.join(', ') : '',
        interests: Array.isArray(currentUser.interests) ? currentUser.interests.join(', ') : '',
        city: currentUser.location?.city || '',
        district: currentUser.location?.district || '',
      });
    }
  }, [currentUser, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStkRequest = async () => {
    setLoading(true);
    try {
      await API.post('/users/request-stk');
      const updatedUser = { ...currentUser, pendingRole: 'stk' };
      updateAuthUser(updatedUser);
      setSuccess('STK olma isteğiniz başarıyla iletildi! Admin onayı bekleniyor.');
    } catch (err) {
      setError(err.response?.data?.message || 'İstek gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Backend'in beklediği tam GeoJSON formatı
      const updatedData = {
        name: formData.name,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        location: {
          type: 'Point',
          coordinates: currentUser.location?.coordinates || [27.1428, 38.4237],
          city: formData.city || 'Belirtilmemiş',
          district: formData.district || 'Belirtilmemiş'
        }
      };

      const res = await API.put('/users/profile', updatedData);
      updateAuthUser(res.data.data || res.data); 
      setSuccess('Profiliniz başarıyla güncellendi!');
      
      setTimeout(() => {
        setIsEditing(false);
        setSuccess('');
      }, 2000);

    } catch (err) {
      console.error("Güncelleme Hatası:", err.response?.data || err);
      setError(err.response?.data?.message || 'Güncelleme sırasında bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Fade in={true} timeout={800}>
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ height: 140, background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' }} />
          
          <Box sx={{ px: { xs: 3, md: 5 }, pb: 5, mt: -6 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3, mb: 4 }}>
              <Avatar 
                src={currentUser.profilePhoto || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`} 
                sx={{ width: 120, height: 120, border: '4px solid white', boxShadow: 3 }}
              />
              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' }, mt: { xs: 2, md: 5 } }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{currentUser.name}</Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mt: 1 }}>
                  {currentUser.role === 'stk' && currentUser.isVerified ? (
                    <Chip icon={<VerifiedUserIcon />} label="ONAYLI STK" color="success" variant="contained" size="small" />
                  ) : currentUser.pendingRole === 'stk' ? (
                    <Chip icon={<PendingActionsIcon />} label="STK ONAYI BEKLENİYOR" color="info" variant="outlined" size="small" />
                  ) : (
                    <Chip label="GÖNÜLLÜ" color="primary" variant="outlined" size="small" />
                  )}
                </Box>
              </Box>
              <Box sx={{ mt: { xs: 2, md: 5 } }}>
                {!isEditing && (
                  <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditing(true)} sx={{ borderRadius: 2 }}>
                    Düzenle
                  </Button>
                )}
              </Box>
            </Box>

            {currentUser.role === 'volunteer' && !currentUser.pendingRole && (
              <Alert 
                severity="warning" 
                action={
                  <Button color="inherit" size="small" startIcon={<UpgradeIcon />} onClick={handleStkRequest}>
                    ŞİMDİ BAŞVUR
                  </Button>
                }
                sx={{ mb: 4, borderRadius: 2 }}
              >
                Kendi etkinliklerinizi oluşturmak ister misiniz? <strong>STK Hesabına Geçiş Yapın!</strong>
              </Alert>
            )}

            {currentUser.pendingRole === 'stk' && (
              <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
                STK başvurunuz inceleniyor. Onaylandığında etkinlik oluşturma yetkisine sahip olacaksınız.
              </Alert>
            )}

            <Divider sx={{ mb: 4 }} />

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

            {!isEditing ? (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>İletişim & Konum</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <EmailIcon color="action" fontSize="small" />
                    <Typography>{currentUser.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <LocationOnIcon color="action" fontSize="small" />
                    <Typography>{currentUser.location?.city || 'Şehir Belirtilmemiş'}, {currentUser.location?.district || ''}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Beceriler & İlgi Alanları</Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>BECERİLER</Typography>
                    {currentUser.skills?.length > 0 ? (
                      currentUser.skills.map((skill, i) => <Chip key={i} label={skill} size="small" sx={{ mr: 1, mb: 1 }} color="primary" variant="outlined" />)
                    ) : <Typography variant="body2" color="textSecondary">Henüz eklenmemiş</Typography>}
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: 'bold', color: 'secondary.main' }}>İLGİ ALANLARI</Typography>
                    {currentUser.interests?.length > 0 ? (
                      currentUser.interests.map((int, i) => <Chip key={i} label={int} size="small" sx={{ mr: 1, mb: 1 }} color="secondary" variant="outlined" />)
                    ) : <Typography variant="body2" color="textSecondary">Henüz eklenmemiş</Typography>}
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}><TextField fullWidth label="İsim" name="name" value={formData.name} onChange={handleChange} variant="outlined" /></Grid>
                  <Grid item xs={12} md={3}><TextField fullWidth label="Şehir" name="city" value={formData.city} onChange={handleChange} /></Grid>
                  <Grid item xs={12} md={3}><TextField fullWidth label="İlçe" name="district" value={formData.district} onChange={handleChange} /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Beceriler (Virgülle ayırın)" name="skills" value={formData.skills} onChange={handleChange} /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="İlgi Alanları (Virgülle ayırın)" name="interests" value={formData.interests} onChange={handleChange} /></Grid>
                  <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="contained" type="submit" disabled={loading} sx={{ px: 4, borderRadius: 2 }}>
                      {loading ? <CircularProgress size={24} /> : 'Kaydet'}
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={() => setIsEditing(false)} sx={{ borderRadius: 2 }}>İptal</Button>
                  </Grid>
                </Grid>
              </form>
            )}

            <Box sx={{ mt: 10, textAlign: 'center' }}>
              <Button color="error" startIcon={<LogoutIcon />} onClick={logout} sx={{ textTransform: 'none' }}>Oturumu Kapat</Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Profile;