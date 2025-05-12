import React from 'react';
import './MapPreview.css';

const MapPreview = () => {
  // Gerçek uygulamada Google Maps API veya OpenStreetMap entegre edilecek
  return (
    <div className="map-preview">
      <div className="map-placeholder">
        <p>Harita burada görüntülenecek</p>
        <div className="map-mock">
          {/* Basit bir harita mockup'ı */}
          <div className="map-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid-cell"></div>
            ))}
          </div>
          <div className="map-pins">
            <div className="pin pin-volunteer"></div>
            <div className="pin pin-emergency"></div>
            <div className="pin pin-event"></div>
          </div>
        </div>
      </div>
      <button className="view-full-map">Tam Haritayı Görüntüle</button>
    </div>
  );
};

export default MapPreview;