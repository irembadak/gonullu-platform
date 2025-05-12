import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Gönüllü Platformu
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Ana Sayfa
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/activities" className="nav-links">
              Gönüllü Faaliyetler
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/emergency" className="nav-links">
              Acil Durum Desteği
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/transportation" className="nav-links">
              Ulaşım Desteği
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-links">
              Profil
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;