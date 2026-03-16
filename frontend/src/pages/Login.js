import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import './Login.css';
import { 
  CircularProgress, Container, Paper, Typography, TextField, 
  Button, Box, InputAdornment, IconButton, Alert, Fade 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/profile');
    } catch (err) {
      handleLoginError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) return setError('Lütfen email adresinizi girin');
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetEmailSent(true);
    } catch (err) {
      setError('Sıfırlama maili gönderilemedi. Email adresinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (err) => {
    let msg = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
    if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') msg = 'Email veya şifre hatalı';
    setError(msg);
  };

  return (
    <div className="login-page-wrapper">
      <Container maxWidth="xs">
        <Fade in={true} timeout={800}>
          <Paper elevation={6} className="login-paper">
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <div className="login-logo-circle">
                <LockIcon sx={{ fontSize: 35, color: 'white' }} />
              </div>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', mt: 2 }}>
                {showResetForm ? 'Şifre Kurtarma' : 'Hoş Geldiniz'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {showResetForm ? 'Email adresinize sıfırlama linki göndereceğiz.' : 'Devam etmek için lütfen giriş yapın.'}
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
            {resetEmailSent && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Sıfırlama bağlantısı gönderildi!</Alert>}

            {!showResetForm ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="E-posta Adresi"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ mb: 2.5 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  label="Şifre"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ mb: 1.5 }}
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
                />
                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Typography variant="caption" className="link-text" onClick={() => setShowResetForm(true)}>
                    Şifremi Unuttum
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  size="large"
                  className="login-btn-styled"
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
                </Button>
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
                  Hesabınız yok mu? <Link to="/register" className="link-text bold">Hemen Kayıt Olun</Link>
                </Typography>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <TextField
                  fullWidth
                  label="Kayıtlı E-posta"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                  }}
                />
                <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mb: 2, py: 1.5 }}>
                   Link Gönder
                </Button>
                <Button 
                  fullWidth 
                  startIcon={<ArrowBackIcon />} 
                  onClick={() => { setShowResetForm(false); setResetEmailSent(false); }}
                  sx={{ color: 'text.secondary', textTransform: 'none' }}
                >
                  Geri Dön
                </Button>
              </form>
            )}
          </Paper>
        </Fade>
      </Container>
    </div>
  );
};

export default Login;