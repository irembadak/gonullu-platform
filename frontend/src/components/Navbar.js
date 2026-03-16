import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Navbar.css';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, 
  Box, Menu, MenuItem, Avatar, Drawer, List, ListItem, 
  ListItemText, Divider, useMediaQuery, useTheme 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { currentUser, loading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  if (loading) return null;
  const navLinks = [
    { title: "Ana Sayfa", path: "/" },
    { title: "Gönüllü Faaliyetler", path: "/activities" },
    { title: "Acil Destek", path: "/emergency" },
    { title: "Ulaşım", path: "/transportation" },
    { title: "AI Öneriler", path: "/recommend" },
    { title: "Etkinlik Oluştur", path: "/create-event" },
  ];
  if (currentUser?.role === "admin") {
    navLinks.push({ title: "Admin Panel", path: "/admin", isAdmin: true });
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 800, color: '#2c3e50' }}>
        MENÜ
      </Typography>
      <Divider />
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.title} disablePadding>
            <NavLink to={item.path} className="mobile-nav-link">
              <ListItemText primary={item.title} />
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} className="custom-navbar">
      <Toolbar className="navbar-toolbar">
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate("/")}>
          <VolunteerActivismIcon sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" className="navbar-logo-text">
            GÖNÜLLÜ PLATFORMU
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 1 }}>
            {navLinks.map((link) => (
              <NavLink 
                key={link.title} 
                to={link.path} 
                className={({ isActive }) => `desktop-link ${isActive ? "active" : ""} ${link.isAdmin ? "admin-glow" : ""}`}
              >
                {link.title}
              </NavLink>
            ))}
          </Box>
        )}

        <Box sx={{ flexGrow: 0 }}>
          {currentUser ? (
            <>
              <IconButton onClick={handleMenu} sx={{ p: 0, border: '2px solid rgba(255,255,255,0.2)' }}>
                <Avatar sx={{ bgcolor: '#3498db' }}>
                  {currentUser.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 2 } }}
              >
                <MenuItem onClick={() => { navigate("/profile"); handleClose(); }}>
                  <AccountCircleIcon sx={{ mr: 1, fontSize: 20 }} /> Profilim
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon sx={{ mr: 1, fontSize: 20 }} /> Çıkış Yap
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate("/login")}>Giriş</Button>
              <Button variant="contained" color="primary" onClick={() => navigate("/register")} sx={{ borderRadius: 2 }}>Kayıt Ol</Button>
            </Box>
          )}
        </Box>
      </Toolbar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 } }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;