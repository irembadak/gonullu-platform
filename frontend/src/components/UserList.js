import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, Button, Chip, Box, Avatar,
  IconButton, Tooltip, Fade, CircularProgress
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/users');
      setUsers(response.data || []);
    } catch (err) {
      console.error('Kullanıcıları çekerken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post('http://localhost:5050/api/sync');
      await fetchUsers();
      alert('Kullanıcı verileri başarıyla senkronize edildi!');
    } catch (err) {
      alert('Senkronizasyon başarısız.');
    } finally {
      setSyncing(false);
    }
  };
  const getRoleChip = (role) => {
    const roles = {
      admin: { label: 'Admin', color: 'error', icon: <AdminPanelSettingsIcon fontSize="small" /> },
      stk: { label: 'STK', color: 'secondary' },
      volunteer: { label: 'Gönüllü', color: 'primary' }
    };
    const current = roles[role?.toLowerCase()] || { label: role, color: 'default' };
    
    return <Chip 
      label={current.label} 
      color={current.color} 
      size="small" 
      icon={current.icon}
      sx={{ fontWeight: 'bold' }} 
    />;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>
            Kullanıcı Yönetimi
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={syncing ? <CircularProgress size={20} /> : <SyncIcon />} 
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? 'Eşitleniyor...' : 'Verileri Senkronize Et'}
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>E-posta</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Yetki Rolü</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#3498db', width: 32, height: 32, fontSize: '0.9rem' }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Detayları Gör">
                      <Button size="small" variant="text">Düzenle</Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
};

export default UserList;