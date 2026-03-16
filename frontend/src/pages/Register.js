import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import { 
  CircularProgress, Container, Paper, Typography, TextField, 
  Button, Box, InputAdornment, IconButton, Alert, Fade, MenuItem
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'volunteer' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        email: formData.email,
        role: formData.role 
      });
      
      setSuccess('Kayıt başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      handleRegisterError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterError = (err) => {
    let msg = 'Kayıt sırasında bir hata oluştu.';
    if (err.code === 'auth/email-already-in-use') msg = 'Bu email zaten kullanımda.';
    if (err.code === 'auth/weak-password') msg = 'Şifre çok zayıf (en az 6 karakter).';
    setError(msg);
  };

  return (
    <div className="register-page-wrapper">
      <Container maxWidth="xs">
        <Fade in={true} timeout={800}>
          <Paper elevation={6} className="register-paper" sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <div className="register-logo-circle" style={{ margin: '0 auto', backgroundColor: '#3498db', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonAddIcon sx={{ fontSize: 35, color: 'white' }} />
              </div>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', mt: 2 }}>
                Kayıt Ol
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Topluluğumuza katılmak için formu doldurun.
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Ad Soyad"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                }}
                required
              />

              {/* ROL SEÇİM ALANI */}
              <TextField
                select
                fullWidth
                label="Hesap Türü"
                name="role"
                value={formData.role}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment>,
                }}
                helperText="STK seçerseniz etkinlik paylaşmak için admin onayı gerekecektir."
              >
                <MenuItem value="volunteer">Gönüllü</MenuItem>
                <MenuItem value="stk">STK / Kurum</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="E-posta Adresi"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                }}
                required
              />
              <TextField
                fullWidth
                label="Şifre"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                size="large"
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2, 
                  textTransform: 'none', 
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#3498db',
                  '&:hover': { backgroundColor: '#2980b9' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Hesap Oluştur'}
              </Button>

              <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
                Zaten hesabınız var mı? <Link to="/login" style={{ color: '#3498db', fontWeight: 'bold', textDecoration: 'none' }}>Giriş Yapın</Link>
              </Typography>
            </form>
          </Paper>
        </Fade>
      </Container>
    </div>
  );
};

export default Register;