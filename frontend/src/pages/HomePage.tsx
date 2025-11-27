import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const featuredGenres = [
    { name: 'Made-Up Magic', genre: 'Fiction', icon: 'bi-book', gradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)' },
    { name: 'Future Shock', genre: 'Science Fiction', icon: 'bi-rocket-takeoff', gradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)' },
    { name: 'Whodunit', genre: 'Mystery', icon: 'bi-search', gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' },
    { name: 'Heart Flutters', genre: 'Romance', icon: 'bi-heart', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
    { name: 'Real Lives', genre: 'Biography', icon: 'bi-person', gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' },
    { name: 'Time Travel', genre: 'History', icon: 'bi-clock-history', gradient: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)' },
  ];

  return (
    <div>
      {/* Hero Section - Unique Asymmetric Design */}
      <section className="hero-section" style={{
        background: 'var(--gradient-primary)',
        minHeight: '90vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="position-absolute w-100 h-100" style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.2) 0%, transparent 50%)',
          zIndex: 0
        }}></div>
        <div className="container position-relative px-3 px-md-4" style={{ zIndex: 1 }}>
          <div className="row align-items-center hero-content" style={{ minHeight: '90vh' }}>
            <div className="col-lg-6">
              <div className="mb-3">
                <span className="badge" style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '50px',
                  fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)'
                }}>
                  <i className="bi bi-fire me-2"></i>
                  Your Next Read Awaits
                </span>
              </div>
              <h1 className="fade-in-up" style={{
                fontSize: 'clamp(2rem, 8vw, 5.5rem)',
                fontWeight: '900',
                lineHeight: '1.1',
                color: 'white',
                marginBottom: '1.5rem',
                letterSpacing: '-0.03em'
              }}>
              Find Books and Library 
                <br />
                That Actually
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Matter and Help!!!
                </span>
              </h1>
              <p className="slide-in-left" style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '2.5rem',
                lineHeight: '1.6',
                maxWidth: '500px'
              }}>
                Real books. Real people. Real recommendations. Build your library, track what matters, and find stories worth your time.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/books" className="btn btn-light btn-lg" style={{
                  padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2.5rem)',
                  borderRadius: '50px',
                  fontWeight: '700',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  border: 'none',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  textAlign: 'center'
                }}>
                  <i className="bi bi-compass me-2"></i>
                  Start Exploring
                </Link>
                <Link to="/signup" className="btn btn-lg" style={{
                  padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2.5rem)',
                  borderRadius: '50px',
                  fontWeight: '700',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  textAlign: 'center'
                }}>
                  Join Free
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative" style={{ height: '600px' }}>
                <div className="position-absolute" style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-5deg)',
                  width: '100%',
                  maxWidth: '450px'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '30px',
                    padding: '3rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <i className="bi bi-book-half float-animation" style={{
                      fontSize: '15rem',
                      color: 'rgba(255, 255, 255, 0.2)',
                      display: 'block'
                    }}></i>
                  </div>
                  <div className="position-absolute" style={{
                    top: '-20px',
                    right: '-20px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '2rem' }}>5K+</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Books</div>
                  </div>
                  <div className="position-absolute" style={{
                    bottom: '20px',
                    left: '-30px',
                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '2rem' }}>4.8</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section className="py-5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container px-3 px-md-4">
          <div className="row text-center mb-4 mb-md-5 pt-4 pt-md-5">
            <div className="col-12">
              <h2 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>Everything You'll Actually Use</h2>
              <p className="lead" style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                No bloat. No BS. Just the tools readers actually need.
              </p>
            </div>
          </div>

          <div className="row g-3 g-md-4">
            <div className="col-12 col-md-8">
              <div className="h-100 border-0 p-4 p-md-5" style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                borderRadius: 'clamp(20px, 4vw, 30px)',
                minHeight: 'clamp(300px, 40vw, 350px)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="position-absolute" style={{
                  top: 0,
                  right: 0,
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  transform: 'translate(30%, -30%)'
                }}></div>
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <div className="mb-3 mb-md-4" style={{
                    width: 'clamp(60px, 10vw, 70px)',
                    height: 'clamp(60px, 10vw, 70px)',
                    borderRadius: 'clamp(15px, 3vw, 20px)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-collection" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'white' }}></i>
                  </div>
                  <h3 className="fw-bold mb-2 mb-md-3" style={{ color: 'white', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>5,000+ Books & Counting</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: '500px' }}>
                    From forgotten classics to today's bestsellers. Every genre. Every mood. All in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="h-100 border-0 p-4" style={{
                background: 'var(--bg-primary)',
                borderRadius: 'clamp(20px, 4vw, 30px)',
                minHeight: 'clamp(250px, 35vw, 350px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="mb-3 mb-md-4" style={{
                  width: 'clamp(50px, 9vw, 60px)',
                  height: 'clamp(50px, 9vw, 60px)',
                  borderRadius: 'clamp(12px, 2.5vw, 15px)',
                  background: 'var(--gradient-sunset)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="bi bi-funnel" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', color: 'white' }}></i>
                </div>
                <h4 className="fw-bold mb-2 mb-md-3" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>Search That Works</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  Actually find what you're looking for. Filter by genre, author, or rating in seconds.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="h-100 border-0 p-4" style={{
                background: 'var(--bg-primary)',
                borderRadius: 'clamp(20px, 4vw, 30px)',
                minHeight: 'clamp(200px, 28vw, 280px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="mb-3 mb-md-4" style={{
                  width: 'clamp(50px, 9vw, 60px)',
                  height: 'clamp(50px, 9vw, 60px)',
                  borderRadius: 'clamp(12px, 2.5vw, 15px)',
                  background: 'var(--gradient-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="bi bi-heart-fill" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', color: 'white' }}></i>
                </div>
                <h4 className="fw-bold mb-2 mb-md-3" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>Your Library</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  Build and organize your personal collection
                </p>
              </div>
            </div>

            <div className="col-12 col-md-8">
              <div className="h-100 border-0 p-4 p-md-5" style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: 'clamp(20px, 4vw, 30px)',
                minHeight: 'clamp(200px, 28vw, 280px)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="position-absolute" style={{
                  bottom: 0,
                  left: 0,
                  width: '250px',
                  height: '250px',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  transform: 'translate(-30%, 30%)'
                }}></div>
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <div className="mb-3 mb-md-4" style={{
                    width: 'clamp(60px, 10vw, 70px)',
                    height: 'clamp(60px, 10vw, 70px)',
                    borderRadius: 'clamp(15px, 3vw, 20px)',
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-stars" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'white' }}></i>
                  </div>
                  <h3 className="fw-bold mb-2 mb-md-3" style={{ color: 'white', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>Your Reading, Your Way</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: '600px' }}>
                    Track what you've read. Rate what you loved. Remember what mattered. Your bookshelf, not ours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Genres Section - Asymmetric Magazine Layout */}
      <section className="py-4 py-md-5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container px-3 px-md-4">
          <div className="row mb-4 mb-md-5 pt-4 pt-md-5">
            <div className="col-lg-6">
              <div className="mb-3">
                <span style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  padding: '0.4rem 1.2rem',
                  borderRadius: '50px',
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
                  fontWeight: '700',
                  display: 'inline-block',
                  letterSpacing: '0.5px'
                }}>
                  BROWSE BY GENRE
                </span>
              </div>
              <h2 className="fw-bold mb-3" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: '1.1' }}>
                Every Kind of Story<br />
                <span style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  You Could Want
                </span>
              </h2>
              <p className="text-muted mb-4" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', maxWidth: '500px' }}>
                Whatever you're into - mysteries, romance, sci-fi, or biographies - we've got the books that'll keep you up past bedtime.
              </p>
            </div>
          </div>

          {/* Staggered Genre Grid */}
          <div className="row g-3 g-md-4 mb-4">
            {/* Row 1 - Fiction & Sci-Fi (Larger) */}
            <div className="col-md-7">
              <Link
                to={`/books?genre=${featuredGenres[0].genre}`}
                className="text-decoration-none d-block h-100"
              >
                <div style={{
                  background: featuredGenres[0].gradient,
                  borderRadius: 'clamp(20px, 4vw, 28px)',
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  minHeight: 'clamp(200px, 30vw, 280px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(40px)'
                  }}></div>
                  <i className={`bi ${featuredGenres[0].icon}`} style={{
                    fontSize: 'clamp(3rem, 8vw, 5rem)',
                    color: 'rgba(255, 255, 255, 0.3)',
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem'
                  }}></i>
                  <div className="position-relative">
                    <h3 className="fw-bold mb-2" style={{ color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                      {featuredGenres[0].name}
                    </h3>
                    <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)' }}>
                      {featuredGenres[0].genre}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-5">
              <Link
                to={`/books?genre=${featuredGenres[1].genre}`}
                className="text-decoration-none d-block h-100"
              >
                <div style={{
                  background: featuredGenres[1].gradient,
                  borderRadius: 'clamp(20px, 4vw, 28px)',
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                  minHeight: 'clamp(200px, 30vw, 280px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className={`bi ${featuredGenres[1].icon}`} style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    color: 'rgba(255, 255, 255, 0.3)',
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem'
                  }}></i>
                  <div className="position-relative">
                    <h4 className="fw-bold mb-1" style={{ color: 'white', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
                      {featuredGenres[1].name}
                    </h4>
                    <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)' }}>
                      {featuredGenres[1].genre}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Row 2 - Mystery, Romance, Biography */}
            <div className="col-6 col-md-4">
              <Link
                to={`/books?genre=${featuredGenres[2].genre}`}
                className="text-decoration-none d-block h-100"
              >
                <div style={{
                  background: featuredGenres[2].gradient,
                  borderRadius: 'clamp(18px, 3.5vw, 24px)',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  minHeight: 'clamp(160px, 25vw, 220px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className={`bi ${featuredGenres[2].icon}`} style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: 'rgba(255, 255, 255, 0.3)',
                    marginBottom: 'auto'
                  }}></i>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: 'white', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
                      {featuredGenres[2].name}
                    </h5>
                    <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)' }}>
                      {featuredGenres[2].genre}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-6 col-md-4">
              <Link
                to={`/books?genre=${featuredGenres[3].genre}`}
                className="text-decoration-none d-block h-100"
              >
                <div style={{
                  background: featuredGenres[3].gradient,
                  borderRadius: 'clamp(18px, 3.5vw, 24px)',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  minHeight: 'clamp(160px, 25vw, 220px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className={`bi ${featuredGenres[3].icon}`} style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: 'rgba(255, 255, 255, 0.3)',
                    marginBottom: 'auto'
                  }}></i>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: 'white', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
                      {featuredGenres[3].name}
                    </h5>
                    <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)' }}>
                      {featuredGenres[3].genre}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-12 col-md-4">
              <Link
                to={`/books?genre=${featuredGenres[4].genre}`}
                className="text-decoration-none d-block h-100"
              >
                <div style={{
                  background: featuredGenres[4].gradient,
                  borderRadius: 'clamp(18px, 3.5vw, 24px)',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  minHeight: 'clamp(160px, 25vw, 220px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className={`bi ${featuredGenres[4].icon}`} style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: 'rgba(255, 255, 255, 0.3)',
                    marginBottom: 'auto'
                  }}></i>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: 'white', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
                      {featuredGenres[4].name}
                    </h5>
                    <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)' }}>
                      {featuredGenres[4].genre}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Row 3 - History (Full Width) */}
            <div className="col-12">
              <Link
                to={`/books?genre=${featuredGenres[5].genre}`}
                className="text-decoration-none d-block"
              >
                <div style={{
                  background: featuredGenres[5].gradient,
                  borderRadius: 'clamp(20px, 4vw, 28px)',
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  minHeight: 'clamp(140px, 20vw, 180px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scaleX(1.01)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scaleX(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <h3 className="fw-bold mb-2" style={{ color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                      {featuredGenres[5].name}
                    </h3>
                    <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)' }}>
                      {featuredGenres[5].genre}
                    </p>
                  </div>
                  <i className={`bi ${featuredGenres[5].icon}`} style={{
                    fontSize: 'clamp(3rem, 7vw, 4.5rem)',
                    color: 'rgba(255, 255, 255, 0.3)'
                  }}></i>
                </div>
              </Link>
            </div>
          </div>

          <div className="text-center mt-4 mt-md-5">
            <Link to="/books" className="btn btn-lg" style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              padding: 'clamp(0.875rem, 2vw, 1rem) clamp(2rem, 5vw, 3rem)',
              borderRadius: '50px',
              fontWeight: '700',
              border: 'none',
              boxShadow: '0 10px 30px rgba(234, 88, 12, 0.3)',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)'
            }}>
              Browse All Genres
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Split Design */}
      <section className="py-4 py-md-5 my-4 my-md-5">
        <div className="container px-3 px-md-4">
          <div className="overflow-hidden" style={{
            borderRadius: 'clamp(25px, 5vw, 40px)',
            background: 'var(--gradient-secondary)',
            position: 'relative',
            minHeight: 'clamp(350px, 50vw, 400px)'
          }}>
            <div className="position-absolute" style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              zIndex: 0
            }}></div>
            <div className="p-4 p-md-5 position-relative" style={{ zIndex: 1 }}>
              <div className="row align-items-center" style={{ minHeight: 'clamp(250px, 35vw, 300px)' }}>
                <div className="col-12 col-lg-7">
                  <div className="mb-2 mb-md-3">
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      color: 'white',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '50px',
                      fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
                      fontWeight: '600',
                      backdropFilter: 'blur(10px)',
                      display: 'inline-block'
                    }}>
                      JOIN THE COMMUNITY
                    </span>
                  </div>
                  <h2 className="fw-bold mb-3 mb-md-4" style={{
                    fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
                    color: 'white',
                    lineHeight: '1.2'
                  }}>
                    Ready to Find Your Next Favorite Book?
                  </h2>
                  <p className="mb-0" style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    maxWidth: '550px'
                  }}>
                    Thousands already tracking their reads here. Join for free, no strings attached.
                  </p>
                </div>
                <div className="col-12 col-lg-5 text-lg-end mt-4 mt-lg-0">
                  <div className="d-flex flex-column gap-3 align-items-lg-end align-items-stretch">
                    <Link to="/signup" className="btn btn-light btn-lg" style={{
                      padding: 'clamp(1rem, 2.5vw, 1.2rem) clamp(2rem, 5vw, 3rem)',
                      borderRadius: '50px',
                      fontWeight: '700',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      border: 'none',
                      fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                      textAlign: 'center'
                    }}>
                      Get Started Free
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                    <p className="mb-0 text-lg-end text-center" style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)'
                    }}>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      No credit card required
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
