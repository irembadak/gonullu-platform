import { useState, useEffect } from 'react';
import './EmergencyForm.css';
import { 
  Box, TextField, MenuItem, Button, Typography, 
  InputAdornment, Grid, CircularProgress 
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';

const EmergencyForm = ({ initialLocation, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    emergencyType: '',
    location: '',
    description: '',
    contactNumber: '',
    peopleCount: 1
  });

  useEffect(() => {
    if (initialLocation) {
      setFormData(prev => ({
        ...prev,
        location: initialLocation 
      }));
    }
  }, [initialLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  const emergencyTypes = [
    { value: 'sağlık', label: 'Tıbbi Acil Durum' },
    { value: 'yangın', label: 'Yangın' },
    { value: 'deprem', label: 'Deprem' },
    { value: 'sel', label: 'Sel' },
    { value: 'diğer', label: 'Diğer' },
  ];

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Acil Durum Türü */}
      <TextField
        select
        fullWidth
        label="Acil Durum Türü"
        name="emergencyType"
        value={formData.emergencyType}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CategoryIcon color="error" />
            </InputAdornment>
          ),
        }}
      >
        {emergencyTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Seçilen Konum Göstergesi */}
      {formData.location && (
        <Box sx={{ p: 2, bgcolor: '#fff5f5', border: '1px dashed #d32f2f', borderRadius: 2 }}>
          <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
            SEÇİLEN KONUM
          </Typography>
          <Typography variant="body2" sx={{ color: '#b71c1c' }}>
            {formData.location}
          </Typography>
        </Box>
      )}

      {/* Açıklama */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Durum Açıklaması"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Yardım ekiplerine detay verin (örn: 3. kat, enkaz altı)"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
              <DescriptionIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2}>
        {/* İletişim Numarası */}
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            label="İletişim Numarası"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="5XXXXXXXXX"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Başında 0 olmadan 10 hane girin"
          />
        </Grid>

        {/* Kişi Sayısı */}
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            type="number"
            label="Kişi Sayısı"
            name="peopleCount"
            inputProps={{ min: 1 }}
            value={formData.peopleCount}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        size="large"
        color="error"
        disabled={isSubmitting}
        sx={{ 
          py: 1.5, 
          fontWeight: 'bold', 
          fontSize: '1.1rem',
          boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)' 
        }}
      >
        {isSubmitting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} color="inherit" />
            BİLDİRİLİYOR...
          </Box>
        ) : 'YARDIM TALEBİ GÖNDER'}
      </Button>
    </Box>
  );
};

export default EmergencyForm;