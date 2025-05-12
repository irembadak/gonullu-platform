import React from 'react';
import './Home.css';
import MapPreview from '../components/MapPreview';
import ActivityCarousel from '../components/ActivityCarousel.js';

const Home = () => {
  return (
    <div className="home">
      <section className="hero-section">
        <h1>Topluma Katkıda Bulunun</h1>
        <p>Yapay zeka destekli gönüllü organizasyon platformuna hoş geldiniz</p>
        <button className="cta-button">Hemen Katıl</button>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Yapay Zeka Destekli Öneriler</h3>
          <p>İlgi alanlarınıza göre gönüllü faaliyetler önerilir</p>
        </div>
        <div className="feature-card">
          <h3>Acil Durum Desteği</h3>
          <p>Kriz anlarında hızlı yardım koordinasyonu</p>
        </div>
        <div className="feature-card">
          <h3>Konum Bazlı Hizmetler</h3>
          <p>Bulunduğunuz çevredeki fırsatları görün</p>
        </div>
      </section>

      <section className="map-section">
        <h2>Yakınınızdaki Gönüllü Faaliyetler</h2>
        <MapPreview />
      </section>

      <section className="activities-section">
        <h2>Popüler Gönüllü Faaliyetler</h2>
        <ActivityCarousel />
      </section>
    </div>
  );
};

export default Home;