import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, TextField, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';

// Leaflet ikon hatalarını çözen standart ayar
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Yer seçme özelliği (Sadece onLocationSelect varsa çalışır)
function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

// Harita merkezini değiştiren yardımcı bileşen
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// KRİTİK DEĞİŞİKLİK: events = [] prop'unu buraya ekledik ki ana sayfadan gelenleri içeri alabilsin.
const MapPreview = ({ onLocationSelect, events = [] }) => {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // İzmir koordinatları
  const [mapCenter, setMapCenter] = useState([38.4237, 27.1428]);

  const handleSearch = async () => {
    if (searchQuery.length < 3) return;
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'tr' }
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Arama yapılamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const selectLocation = (res) => {
    const lat = parseFloat(res.lat);
    const lon = parseFloat(res.lon);
    setPosition({ lat, lng: lon });
    setMapCenter([lat, lon]);
    if (onLocationSelect) {
      onLocationSelect(lat, lon);
    }
    setSearchResults([]);
    setSearchQuery(res.display_name);
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', minHeight: '400px' }}>
      
      {/* Sadece onLocationSelect (yer seçme) modu aktifse arama çubuğunu göster */}
      {onLocationSelect && (
        <Box sx={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '90%' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Yer ara ve Enter'a bas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                endAdornment: loading ? <CircularProgress size={20} /> : null,
              }}
            />
          </Paper>
          {searchResults.length > 0 && (
            <Paper sx={{ maxHeight: 200, overflow: 'auto', mt: 1, width: '90%' }}>
              <List dense>
                {searchResults.map((res, index) => (
                  <ListItem button key={index} onClick={() => selectLocation(res)}>
                    <ListItemText primary={res.display_name} primaryTypographyProps={{ fontSize: '11px' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}

      <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%', minHeight: '400px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ChangeView center={mapCenter} />
        
        {/* Tıklayarak yer seçme iğnesi (Eğer onLocationSelect varsa) */}
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />

        {/* EĞER DIŞARIDAN ETKİNLİKLER (events) GELDİYSE ONLARI HARİTAYA DİZ */}
        {events && events.length > 0 && events.map((event) => {
          // MongoDB konumları [boylam, enlem] olarak kaydeder, Leaflet ise [enlem, boylam] okur.
          if (event.location && event.location.coordinates && event.location.coordinates.length === 2) {
            const lng = event.location.coordinates[0];
            const lat = event.location.coordinates[1];
            
            return (
              <Marker key={event._id} position={[lat, lng]}>
                <Popup>
                  <strong style={{ fontSize: '14px' }}>{event.title || event.name}</strong><br/>
                  <span style={{ color: '#666', fontSize: '12px' }}>Kategori: {event.category || 'Genel'}</span><br/>
                  <a href="/activities" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>
                    İncele
                  </a>
                </Popup>
              </Marker>
            );
          }
          return null; // Koordinatı yoksa haritaya basma
        })}
      </MapContainer>
    </Box>
  );
};

export default MapPreview;