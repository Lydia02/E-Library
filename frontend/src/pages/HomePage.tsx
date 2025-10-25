import React from 'react';
import Header from '../components/Header';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <Header />
      <main className="main-content">
        <section className="hero">
          <h1>Welcome to E-Library Africa</h1>
          <p className="hero-subtitle">
            Bridging the Knowledge Gap Across Africa
          </p>
          <p className="hero-description">
            Access to books and educational materials remains a major challenge in many African communities,
            particularly in rural and underserved urban areas. Our platform provides a simple, affordable,
            and accessible digital solution that allows users to discover and access book information from
            any location with an internet connection.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Explore Books</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </section>

        <section className="features">
          <h2>Why E-Library Africa?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📚 Vast Collection</h3>
              <p>Access thousands of books and educational materials</p>
            </div>
            <div className="feature-card">
              <h3>🌍 Accessible Anywhere</h3>
              <p>Read from any device with an internet connection</p>
            </div>
            <div className="feature-card">
              <h3>💡 Support Learning</h3>
              <p>Resources for students, educators, and lifelong learners</p>
            </div>
            <div className="feature-card">
              <h3>🚀 Always Updated</h3>
              <p>Fresh content and up-to-date materials</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
