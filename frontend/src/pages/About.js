import React from 'react';
import { Container, Typography, Paper, Grid, Box, Divider, Card, CardContent, Fade } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const About = () => {
  const features = [
    { title: "AI Destekli Eşleşme", desc: "Kullanıcı ilgi alanları ve becerilerini analiz ederek en uygun gönüllülük fırsatlarını öneririz.", icon: <PsychologyIcon color="primary" fontSize="large" /> },
    { title: "Gerçek Zamanlı Koordinasyon", desc: "Afet ve acil durumlarda konum tabanlı bildirimlerle hızlı müdahale sağlarız.", icon: <LocationOnIcon color="error" fontSize="large" /> },
    { title: "Gönüllü Ekosistemi", desc: "STK'lar ve gönüllüler arasında şeffaf, güvenilir ve sürdürülebilir bir bağ kurarız.", icon: <GroupsIcon color="success" fontSize="large" /> }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Fade in={true} timeout={1000}>
        <Box>
          {/* Üst Başlık Alanı */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <VolunteerActivismIcon sx={{ fontSize: 60, color: '#3498db', mb: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#2c3e50', mb: 2 }}>
              Gönüllü Platformu
            </Typography>
            <Typography variant="h5" color="textSecondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Teknoloji ile iyiliği birleştirerek afet ve kriz anlarında toplumsal dayanışmayı dijitalleştiriyoruz.
            </Typography>
          </Box>

          <Grid container spacing={5} alignItems="center">
            {/* Misyon & Vizyon Bölümü */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Misyonumuz</Typography>
                <Typography variant="body1" paragraph color="textSecondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Gönüllü Organizasyon ve Destek Platformu, özellikle afet durumlarında gönüllüler ile ihtiyaç sahiplerini saniyeler içinde bir araya getirmek için geliştirildi.
                  Statik listeler yerine, dinamik ve konum tabanlı çözümler üreterek her yardım elinin en doğru yere ulaşmasını sağlıyoruz.
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ fontStyle: 'italic', color: '#34495e' }}>
                  "İyilik, doğru zamanda ve doğru yerde yapıldığında dünyayı değiştirir."
                </Typography>
              </Paper>
            </Grid>

            {/* Özellikler Grid */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {features.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'scale(1.02)', boxShadow: 2 } }}>
                      <CardContent sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        {item.icon}
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                          <Typography variant="body2" color="textSecondary">{item.desc}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Ekip Bölümü (Opsiyonel ama CV için önerilir) */}
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Proje Hakkında</Typography>
            <Typography color="textSecondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Bu platform, Dokuz Eylül Üniversitesi Bilgisayar Programcılığı bölümü kapsamında 
              <b> İrem Badak</b> ve Efşan Ezici tarafından, toplumsal bir soruna teknolojik bir çözüm üretme vizyonuyla geliştirilmiştir.
              Full-stack olarak kurgulanan sistemde React, Node.js, MongoDB ve Yapay Zeka entegrasyonları kullanılmıştır.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default About;