import React from 'react';
import { 
  Container, Typography, Box, Paper, Grid, 
  List, ListItem, ListItemIcon, ListItemText, Divider, Fade 
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkedInIcon from '@mui/icons-material/LinkedIn'; // CV için ekledim
import GitHubIcon from '@mui/icons-material/GitHub'; // CV için ekledim

const Contact = () => {
  const contactDetails = [
    { icon: <EmailIcon color="primary" />, primary: "Email", secondary: "irembadak3@gmail.com" },
    { icon: <PhoneIcon color="primary" />, primary: "Telefon", secondary: "+90 541 450 96 61" },
    { icon: <BusinessIcon color="primary" />, primary: "Adres", secondary: "DEÜ İMYO, Bilgisayar Programcılığı Bölümü" },
    { icon: <AccessTimeIcon color="primary" />, primary: "Destek Saatleri", secondary: "Hafta içi her gün 09:00 - 17:00" },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Fade in={true} timeout={1000}>
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Grid container>
            {/* Sol Taraf: Görsel ve Başlık */}
            <Grid item xs={12} md={5} sx={{ 
              background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', 
              color: 'white', 
              p: 6, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center' 
            }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>İletişime Geçin</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
                Platformumuzla ilgili sorularınız, teknik destek talepleriniz veya iş birliği önerileriniz için bizimle iletişime geçebilirsiniz.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LinkedInIcon sx={{ cursor: 'pointer' }} onClick={() => window.open('https://linkedin.com', '_blank')} />
                <GitHubIcon sx={{ cursor: 'pointer' }} onClick={() => window.open('https://github.com', '_blank')} />
              </Box>
            </Grid>

            {/* Sağ Taraf: Bilgiler */}
            <Grid item xs={12} md={7} sx={{ p: 4 }}>
              <List sx={{ py: 0 }}>
                {contactDetails.map((detail, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Box sx={{ 
                          bgcolor: '#f0f7ff', 
                          p: 1.5, 
                          borderRadius: '50%', 
                          display: 'flex' 
                        }}>
                          {detail.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="subtitle2" color="textSecondary">{detail.primary}</Typography>}
                        secondary={<Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>{detail.secondary}</Typography>}
                      />
                    </ListItem>
                    {index < contactDetails.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Contact;