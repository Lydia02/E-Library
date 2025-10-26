import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleAddCommunityBook = () => {
    if (!isAuthenticated) {
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', '/add-community-book');
      navigate('/login');
    } else {
      navigate('/add-community-book');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04)',
      padding: '1rem 0'
    }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{
          fontWeight: '900',
          fontSize: '1.5rem',
          color: 'var(--text-primary)',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem'
          }}>
            <i className="bi bi-book-fill" style={{ fontSize: '1.25rem', color: 'white' }}></i>
          </div>
          <span style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            E-Library
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '10px',
            padding: '0.5rem 0.75rem'
          }}
        >
          <i className="bi bi-list" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  color: isActive('/') ? 'white' : 'var(--text-primary)',
                  background: isActive('/') ? 'var(--gradient-primary)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/')) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/')) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/books"
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  color: isActive('/books') ? 'white' : 'var(--text-primary)',
                  background: isActive('/books') ? 'var(--gradient-primary)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/books')) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/books')) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Browse
              </Link>
            </li>

            <li className="nav-item">
              <button
                onClick={handleAddCommunityBook}
                className="nav-link"
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
                }}
              >
                <i className="bi bi-globe"></i>
                <span>Share Book</span>
              </button>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/dashboard"
                    style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: '600',
                      color: isActive('/dashboard') ? 'white' : 'var(--text-primary)',
                      background: isActive('/dashboard') ? 'var(--gradient-primary)' : 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive('/dashboard')) {
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/dashboard')) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center"
                    to="/favorites"
                    style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: '600',
                      color: isActive('/favorites') ? 'white' : 'var(--text-primary)',
                      background: isActive('/favorites') ? 'var(--gradient-primary)' : 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive('/favorites')) {
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/favorites')) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <i className="bi bi-heart-fill me-2"></i>
                    Favorites
                  </Link>
                </li>
                <li className="nav-item dropdown ms-lg-2">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-secondary)',
                      border: 'none'
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center me-2"
                      style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '10px',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '700'
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="d-none d-lg-inline">Account</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end mt-2" style={{
                    borderRadius: '16px',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    padding: '0.75rem',
                    minWidth: '220px'
                  }}>
                    <li className="px-3 py-2">
                      <div className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {user?.name}
                      </div>
                      <small style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                        {user?.email}
                      </small>
                    </li>
                    <li><hr className="dropdown-divider my-2" /></li>
                    <li>
                      <Link className="dropdown-item" to="/profile" style={{
                        padding: '0.625rem 1rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        transition: 'all 0.2s ease'
                      }}>
                        <i className="bi bi-person me-2" style={{ color: 'var(--primary-color)' }}></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/library" style={{
                        padding: '0.625rem 1rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        transition: 'all 0.2s ease'
                      }}>
                        <i className="bi bi-book me-2" style={{ color: 'var(--primary-color)' }}></i>
                        My Library
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/add-book" style={{
                        padding: '0.625rem 1rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        transition: 'all 0.2s ease'
                      }}>
                        <i className="bi bi-plus-lg me-2" style={{ color: 'var(--primary-color)' }}></i>
                        Add Book
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-2" /></li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={logout}
                        style={{
                          padding: '0.625rem 1rem',
                          borderRadius: '10px',
                          fontWeight: '600',
                          color: 'var(--danger-color)',
                          transition: 'all 0.2s ease',
                          border: 'none',
                          background: 'none',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn"
                    to="/signup"
                    style={{
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      padding: '0.625rem 1.5rem',
                      borderRadius: '12px',
                      fontWeight: '700',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(234, 88, 12, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.3)';
                    }}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
