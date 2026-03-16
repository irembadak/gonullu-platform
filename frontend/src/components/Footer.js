import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Container, Typography, Stack, IconButton, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="footer-modern">
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4} 
          justifyContent="space-between" 
          alignItems="center"
          sx={{ pb: 4 }}
        >
          {/* Logo ve Kısa Açıklama */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: '400px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mb: 1 }}>
              <VolunteerActivismIcon sx={{ color: '#3498db' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', letterSpacing: 1 }}>
                GÖNÜLLÜ PLATFORMU
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#bdc3c7' }}>
              Afet ve kriz anlarında toplumsal dayanışmayı dijital bir ağ üzerinden koordine eden, teknoloji odaklı iyilik köprüsü.
            </Typography>
          </Box>

          {/* Hızlı Linkler */}
          <Stack direction="row" spacing={3} className="footer-links-modern">
            <NavLink to="/about">Hakkımızda</NavLink>
            <NavLink to="/contact">İletişim</NavLink>
            <NavLink to="/volunteer-activities">Etkinlikler</NavLink>
          </Stack>

          {/* Sosyal Medya */}
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: 'white', '&:hover': { color: '#3498db' } }} onClick={() => window.open('https://github.com', '_blank')}>
              <GitHubIcon />
            </IconButton>
            <IconButton sx={{ color: 'white', '&:hover': { color: '#3498db' } }} onClick={() => window.open('https://linkedin.com', '_blank')}>
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        {/* Alt Bilgi */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems="center"
          spacing={1}
        >
          <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
            © {currentYear} Gönüllü Organizasyon ve Destek Platformu. Tüm hakları saklıdır.
          </Typography>
          <Typography variant="caption" sx={{ color: '#7f8c8d', fontStyle: 'italic' }}>
            Dokuz Eylül Üniversitesi • Bilgisayar Programcılığı Projesi
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;