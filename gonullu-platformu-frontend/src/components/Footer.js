import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Gönüllü Organizasyon ve Destek Platformu</p>
        <p>Bir Okul Projesidir!</p>
        <div className="footer-links">
          <a href="/about">Hakkımızda</a>
          <a href="/contact">İletişim</a>
          <a href="/privacy">Gizlilik Politikası</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;