import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookCard from '../components/BookCard';
import type { Book, UserStats } from '../types';
import { API_ENDPOINTS } from '../config/api';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);

  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCurrentlyReading(),
        fetchRecommendations(),
        fetchUserStats()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentlyReading = async () => {
    try {
      
      setCurrentlyReading([]);
    } catch (error) {
      console.error('Error fetching currently reading books:', error);
      setCurrentlyReading([]);
    }
  };



  const fetchRecommendations = async () => {
    try {
      // Fetch some books for recommendations
      const response = await fetch('API_ENDPOINTS.BOOKS?limit=6');
      if (response.ok) {
        const data = await response.json();
        // The API returns books in data.data.books structure
        const books = data.data?.books || data.books || [];
        const booksArray = Array.isArray(books) ? books : [];
        setRecommendations(booksArray.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      console.log('Dashboard: Fetching user stats...');
      // Fetch user book stats from the user-books API (same as ProfilePage)
      const response = await fetch('https://summative-a-react-discovery-app-lydia02.onrender.com/api/user-books/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard: Stats response:', data);
        const stats = data.data?.stats || {};

        // Map the stats to the expected format
        const userStats: UserStats = {
          totalBooksRead: stats.totalBooksRead || 0,
          currentlyReading: stats.currentlyReading || 0,
          toRead: stats.toRead || 0,
          toReadCount: stats.toRead || 0,
          totalBooks: (stats.totalBooksRead || 0) + (stats.currentlyReading || 0) + (stats.toRead || 0),
          favoriteGenres: stats.favoriteGenres || [],
          readingGoalProgress: {
            goal: 50,
            current: stats.totalBooksRead || 0,
            percentage: Math.round(((stats.totalBooksRead || 0) / 50) * 100)
          },
          averageRating: stats.averageRating || 0,
          booksAddedThisMonth: stats.booksAddedThisMonth || 0,
          currentStreak: 0,
          totalPagesRead: 0,
          recentActivity: []
        };

        console.log('Dashboard: Mapped user stats:', userStats);
        setUserStats(userStats);
      } else {
        throw new Error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      const defaultStats: UserStats = {
        totalBooksRead: 0,
        currentlyReading: 0,
        toRead: 0,
        toReadCount: 0,
        totalBooks: 0,
        favoriteGenres: [],
        readingGoalProgress: {
          goal: user?.readingGoal || 50,
          current: 0,
          percentage: 0
        },
        averageRating: 0,
        booksAddedThisMonth: 0,
        currentStreak: 0,
        totalPagesRead: 0,
        recentActivity: []
      };
      setUserStats(defaultStats);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mt-5 pt-5">
        <div className="row min-vh-75 align-items-center justify-content-center">
          <div className="col-lg-6 text-center">
            <div
              className="rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: '120px',
                height: '120px',
                background: 'var(--gradient-primary)',
              }}
            >
              <i className="bi bi-person-fill text-white" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className="display-5 fw-bold mb-3">Welcome to BookHub</h2>
            <p className="lead text-muted mb-4">
              Sign in to access your personal reading dashboard and start tracking your books
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/login" className="btn btn-primary btn-lg">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline-primary btn-lg">
                <i className="bi bi-person-plus me-2"></i>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      {/* Welcome Header */}
      <div className="row mb-4 mb-md-5">
        <div className="col-12">
          <div
            className="card border-0 text-white"
            style={{
              background: 'var(--gradient-primary)',
              borderRadius: 'clamp(20px, 4vw, 28px)',
              boxShadow: '0 10px 30px rgba(234, 88, 12, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative Background Elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }}></div>

            <div className="card-body p-4 p-md-5 position-relative">
              <div className="row align-items-center g-4">
                <div className="col-lg-7">
                  <h1 className="fw-bold mb-2 mb-md-3" style={{
                    letterSpacing: '-0.5px',
                    fontSize: 'clamp(1.75rem, 5vw, 3rem)'
                  }}>
                    Hey {user?.displayName?.split(' ')[0] || user?.name}! 👋
                  </h1>
                  <p className="lead mb-0" style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    opacity: 0.95,
                    maxWidth: '500px'
                  }}>
                    What's on your reading list today?
                  </p>
                </div>
                <div className="col-lg-5">
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end">
                    <Link
                      to="/add-book"
                      className="btn btn-light"
                      style={{
                        borderRadius: '14px',
                        fontWeight: '600',
                        padding: 'clamp(0.65rem, 1.5vw, 0.85rem) clamp(1.25rem, 3vw, 1.75rem)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        color: 'var(--primary-color)'
                      }}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Add Book
                    </Link>
                    <Link
                      to="/library"
                      className="btn btn-outline-light"
                      style={{
                        borderRadius: '14px',
                        fontWeight: '600',
                        padding: 'clamp(0.65rem, 1.5vw, 0.85rem) clamp(1.25rem, 3vw, 1.75rem)',
                        borderWidth: '2px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                      }}
                    >
                      <i className="bi bi-library me-2"></i>
                      My Library
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4 mb-md-5 g-3 g-md-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 text-center h-100" style={{
            borderRadius: 'clamp(16px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
            color: 'white',
            boxShadow: '0 8px 20px rgba(234, 88, 12, 0.25)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body p-3 p-md-4">
              <div className="fw-bold mb-2" style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)'
              }}>
                {userStats?.totalBooksRead || 0}
              </div>
              <p className="mb-0" style={{
                opacity: 0.95,
                fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                fontWeight: '500'
              }}>Books Read</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 text-center h-100" style={{
            borderRadius: 'clamp(16px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            color: 'white',
            boxShadow: '0 8px 20px rgba(220, 38, 38, 0.25)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body p-3 p-md-4">
              <div className="fw-bold mb-2" style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)'
              }}>
                {userStats?.currentlyReading || 0}
              </div>
              <p className="mb-0" style={{
                opacity: 0.95,
                fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                fontWeight: '500'
              }}>Reading Now</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 text-center h-100" style={{
            borderRadius: 'clamp(16px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
            color: 'white',
            boxShadow: '0 8px 20px rgba(217, 119, 6, 0.25)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body p-3 p-md-4">
              <div className="fw-bold mb-2" style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)'
              }}>
                {userStats?.toReadCount || 0}
              </div>
              <p className="mb-0" style={{
                opacity: 0.95,
                fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                fontWeight: '500'
              }}>Want to Read</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 text-center h-100" style={{
            borderRadius: 'clamp(16px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: 'white',
            boxShadow: '0 8px 20px rgba(251, 191, 36, 0.25)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body p-3 p-md-4">
              <div className="fw-bold mb-2" style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)'
              }}>
                {userStats?.averageRating ? userStats.averageRating.toFixed(1) : '0.0'}
              </div>
              <p className="mb-0" style={{
                opacity: 0.95,
                fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                fontWeight: '500'
              }}>Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Goal Progress */}
      {userStats?.readingGoalProgress && (
        <div className="row mb-4 mb-md-5">
          <div className="col-12">
            <div className="card border-0" style={{
              background: 'var(--bg-primary)',
              borderRadius: 'clamp(18px, 3.5vw, 24px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '2px solid var(--border-light)'
            }}>
              <div className="card-body p-3 p-md-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-3">
                  <h5 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
                    <i className="bi bi-target me-2" style={{ color: 'var(--primary-color)' }}></i>
                    Reading Goal Progress
                  </h5>
                  <Link to="/profile?tab=stats" className="btn btn-sm" style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.5rem 1.25rem',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    View Details
                  </Link>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  <span className="text-muted">
                    {userStats.readingGoalProgress.current} of {userStats.readingGoalProgress.goal} books
                  </span>
                  <span className="fw-bold" style={{ color: 'var(--primary-color)' }}>
                    {userStats.readingGoalProgress.percentage}%
                  </span>
                </div>
                <div className="progress" style={{ height: 'clamp(10px, 2vw, 14px)', borderRadius: '10px', background: 'var(--bg-tertiary)' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${userStats.readingGoalProgress.percentage}%`,
                      background: 'var(--gradient-primary)',
                      borderRadius: '10px',
                      transition: 'width 1s ease'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        {/* Currently Reading */}
        <div className="col-lg-6">
          <div className="card border-0 h-100" style={{
            background: 'var(--bg-primary)',
            borderRadius: 'clamp(18px, 3.5vw, 24px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '2px solid var(--border-light)'
          }}>
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
                <h5 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}>
                  <i className="bi bi-book-half me-2" style={{ color: '#16a34a' }}></i>
                  Currently Reading
                </h5>
                <Link to="/library?filter=currently-reading" className="btn btn-sm" style={{
                  background: 'rgba(234, 88, 12, 0.1)',
                  color: 'var(--primary-color)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.4rem 1rem',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}>
                  View All
                </Link>
              </div>
              {currentlyReading.length > 0 ? (
                <div className="row">
                  {currentlyReading.slice(0, 2).map((userBook) => (
                    <div key={userBook.id} className="col-12 mb-3">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div
                            className="rounded d-flex align-items-center justify-content-center"
                            style={{
                              width: '60px',
                              height: '80px',
                              background: 'var(--bg-tertiary)'
                            }}
                          >
                            <i className="bi bi-book" style={{ fontSize: '1.5rem', color: 'var(--text-light)' }}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-semibold">{userBook.title}</h6>
                          <p className="text-muted small mb-2">{userBook.author}</p>
                          <div className="progress" style={{ height: '6px', borderRadius: '6px', background: 'var(--bg-tertiary)' }}>
                            <div
                              className="progress-bar"
                              style={{ width: '0%', background: '#16a34a' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(234, 88, 12, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <i className="bi bi-book" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
                  </div>
                  <p className="text-muted mb-3" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                    Nothing in progress yet
                  </p>
                  <Link to="/books" className="btn btn-sm" style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.5rem 1.5rem',
                    fontWeight: '600'
                  }}>
                    Find Something to Read
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-6">
          <div className="card border-0 h-100" style={{
            background: 'var(--bg-primary)',
            borderRadius: 'clamp(18px, 3.5vw, 24px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '2px solid var(--border-light)'
          }}>
            <div className="card-body p-3 p-md-4">
              <h5 className="mb-3 mb-md-4 fw-bold" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}>
                <i className="bi bi-lightning me-2" style={{ color: '#fbbf24' }}></i>
                Quick Actions
              </h5>
              <div className="d-grid gap-2 gap-md-3">
                <Link to="/add-book" className="btn text-start" style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.background = 'rgba(234, 88, 12, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}>
                  <i className="bi bi-plus-lg me-2" style={{ color: 'var(--primary-color)' }}></i>
                  Add a Book I've Read
                </Link>
                <Link to="/add-community-book" className="btn text-start" style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  fontWeight: '600',
                  color: 'white',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
                }}>
                  <i className="bi bi-globe me-2"></i>
                  Share Book with Community
                </Link>
                <Link to="/books" className="btn text-start" style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.background = 'rgba(234, 88, 12, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}>
                  <i className="bi bi-search me-2" style={{ color: '#dc2626' }}></i>
                  Browse Books
                </Link>
                <Link to="/favorites" className="btn text-start" style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.background = 'rgba(234, 88, 12, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}>
                  <i className="bi bi-heart me-2" style={{ color: '#d97706' }}></i>
                  View My Favorites
                </Link>
                <Link to="/library?filter=to-read" className="btn text-start" style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.background = 'rgba(234, 88, 12, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}>
                  <i className="bi bi-bookmark me-2" style={{ color: '#f59e0b' }}></i>
                  My Reading List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="row mb-4 mb-md-5">
        <div className="col-12">
          <div className="card border-0" style={{
            background: 'var(--bg-primary)',
            borderRadius: 'clamp(18px, 3.5vw, 24px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '2px solid var(--border-light)'
          }}>
            <div className="card-body p-3 p-md-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-3">
                <h5 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
                  <i className="bi bi-stars me-2" style={{ color: '#fbbf24' }}></i>
                  Books You Might Like
                </h5>
                <Link to="/books" className="btn btn-sm" style={{
                  background: 'rgba(234, 88, 12, 0.1)',
                  color: 'var(--primary-color)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.5rem 1.25rem',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  See All
                </Link>
              </div>
              {recommendations.length > 0 ? (
                <div className="row g-3">
                  {recommendations.map((book) => (
                    <div key={book.id} className="col-6 col-md-6 col-lg-4">
                      <BookCard
                        book={book}
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 py-md-5">
                  <div style={{
                    width: 'clamp(80px, 15vw, 100px)',
                    height: 'clamp(80px, 15vw, 100px)',
                    borderRadius: '50%',
                    background: 'rgba(251, 191, 36, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <i className="bi bi-lightbulb" style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      color: '#fbbf24'
                    }}></i>
                  </div>
                  <h6 className="fw-bold mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
                    Building Your Recommendations
                  </h6>
                  <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', maxWidth: '450px', margin: '0 auto' }}>
                    Add a few books to your library and we'll suggest titles you'll love
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0" style={{
            background: 'var(--bg-primary)',
            borderRadius: 'clamp(18px, 3.5vw, 24px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '2px solid var(--border-light)'
          }}>
            <div className="card-body p-3 p-md-4">
              <h5 className="mb-3 mb-md-4 fw-bold" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
                <i className="bi bi-clock-history me-2" style={{ color: '#ea580c' }}></i>
                Recent Activity
              </h5>
              <div className="text-center py-4 py-md-5">
                <div style={{
                  width: 'clamp(80px, 15vw, 100px)',
                  height: 'clamp(80px, 15vw, 100px)',
                  borderRadius: '50%',
                  background: 'rgba(234, 88, 12, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <i className="bi bi-activity" style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: 'var(--primary-color)'
                  }}></i>
                </div>
                <h6 className="fw-bold mb-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
                  No Activity Yet
                </h6>
                <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', maxWidth: '450px', margin: '0 auto' }}>
                  Your reading activity will show up here once you start adding books
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;