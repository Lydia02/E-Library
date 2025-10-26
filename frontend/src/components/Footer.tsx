import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5 className="mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              <i className="bi bi-book-fill me-2"></i>
              E-Library
            </h5>
            <p className="text-light mb-3">
              Discover your next favorite book. Browse through thousands of titles across all genres.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/books">Discover Books</Link>
              </li>
              <li className="mb-2">
                <Link to="/favorites">Favorites</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h6 className="mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#">Fiction</a>
              </li>
              <li className="mb-2">
                <a href="#">Non-Fiction</a>
              </li>
              <li className="mb-2">
                <a href="#">Science Fiction</a>
              </li>
              <li className="mb-2">
                <a href="#">Mystery</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="mb-3">Contact Us</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                info@elibrary.com
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +1 (555) 123-4567
              </li>
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 Book Street, Reading City
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 bg-light opacity-25" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">
              &copy; {currentYear} E-Library. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="me-3">Privacy Policy</a>
            <a href="#" className="me-3">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
