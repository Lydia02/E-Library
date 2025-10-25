import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">E-Library Africa</h1>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/books">Books</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
