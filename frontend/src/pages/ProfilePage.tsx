import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContainer';
import type { User, UserStats, UserBook } from '../types';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, ToastContainer } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, user]); // Added user dependency to re-fetch when user updates

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch user book stats from the user-books API
      const response = await fetch('https://summative-a-react-discovery-app-lydia02.onrender.com/api/user-books/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const stats = data.data?.stats || {};

        // Map the stats to the expected format
        setUserStats({
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
        });
      } else {
        throw new Error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to default data on error
      setUserStats({
        totalBooksRead: 0,
        currentlyReading: 0,
        toRead: 0,
        toReadCount: 0,
        totalBooks: 0,
        favoriteGenres: [],
        readingGoalProgress: { goal: 50, current: 0, percentage: 0 },
        averageRating: 0,
        booksAddedThisMonth: 0,
        currentStreak: 0,
        totalPagesRead: 0,
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData: Partial<User>) => {
    try {
      // Use AuthContext's updateProfile method which properly updates user state
      await updateProfile(formData);
      // Refresh user data
      await fetchUserData();
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile. Please try again.');
      throw error; // Let the modal handle the error display
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container-fluid px-2 px-sm-3 px-md-4 mt-3 mt-md-5 pt-3 pt-md-5" style={{ maxWidth: '1200px' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4 mt-3 mt-md-5 pt-3 pt-md-5" style={{ maxWidth: '1200px' }}>
      <div className="row">
        {/* Profile Header */}
        <div className="col-12">
          <div className="card border-0 shadow-sm mb-3 mb-md-4" style={{ borderRadius: 'clamp(18px, 3.5vw, 24px)', overflow: 'hidden' }}>
            <div
              className="card-header border-0 text-white"
              style={{ background: 'var(--gradient-primary)', minHeight: 'clamp(180px, 30vw, 200px)', padding: 'clamp(1.5rem, 3vw, 2rem)' }}
            >
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end h-100 pb-3 pb-md-4">
                <div className="d-flex align-items-center mb-3 mb-md-0">
                  <div className="me-3 me-md-4">
                    <div className="profile-avatar d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: 'clamp(60px, 12vw, 80px)', height: 'clamp(60px, 12vw, 80px)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 'bold' }}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-1" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>{user?.displayName || user?.name}</h2>
                    <p className="mb-1 opacity-75" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{user?.email}</p>
                    {user?.location && (
                      <p className="mb-0 opacity-75" style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)' }}>
                        <i className="bi bi-geo-alt me-1"></i>
                        {user.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ms-auto align-self-start align-self-md-end">
                  <button
                    className="btn"
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                      padding: 'clamp(0.625rem, 1.5vw, 0.75rem) clamp(1rem, 2.5vw, 1.25rem)',
                      borderRadius: 'clamp(10px, 2vw, 12px)',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      fontWeight: '600',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    <span className="d-none d-sm-inline">Edit Profile</span>
                    <span className="d-inline d-sm-none">Edit</span>
                  </button>
                </div>
              </div>
            </div>

            {user?.bio && (
              <div className="card-body" style={{ padding: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="col-12">
          <ul className="nav nav-pills mb-3 mb-md-4 flex-nowrap overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                style={{
                  padding: 'clamp(0.625rem, 1.5vw, 0.75rem) clamp(1rem, 2.5vw, 1.25rem)',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="bi bi-grid me-2"></i>
                <span className="d-none d-sm-inline">Overview</span>
                <span className="d-inline d-sm-none">Home</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
                style={{
                  padding: 'clamp(0.625rem, 1.5vw, 0.75rem) clamp(1rem, 2.5vw, 1.25rem)',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="bi bi-graph-up me-2"></i>
                Stats
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="col-12">
          {activeTab === 'overview' && (
            <ProfileOverviewTab userStats={userStats} userBooks={userBooks} />
          )}
          {activeTab === 'stats' && (
            <ProfileStatsTab userStats={userStats} />
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <EditProfileModal 
          user={user!}
          onSave={handleProfileUpdate}
          onClose={() => setIsEditing(false)}
        />
      )}
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

// Overview Tab Component
const ProfileOverviewTab: React.FC<{ userStats: UserStats | null; userBooks: UserBook[] }> = ({ 
  userStats, 
  userBooks 
}) => {
  const recentBooks = userBooks.slice(0, 6);

  return (
    <div className="row g-3 g-md-4">
      {/* Quick Stats */}
      <div className="col-6 col-md-4 mb-3 mb-md-4">
        <div className="card border-0" style={{
          background: 'var(--bg-primary)',
          borderRadius: 'clamp(16px, 3vw, 20px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '2px solid var(--border-light)'
        }}>
          <div className="card-body text-center p-3 p-md-4">
            <div className="fw-bold mb-2" style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              color: 'var(--primary-color)'
            }}>
              {userStats?.totalBooksRead || 0}
            </div>
            <p className="mb-0" style={{
              fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              color: 'var(--text-secondary)'
            }}>Books Read</p>
          </div>
        </div>
      </div>
      
      <div className="col-6 col-md-4 mb-3 mb-md-4">
        <div className="card border-0" style={{
          background: 'var(--bg-primary)',
          borderRadius: 'clamp(16px, 3vw, 20px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '2px solid var(--border-light)'
        }}>
          <div className="card-body text-center p-3 p-md-4">
            <div className="fw-bold mb-2" style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              color: '#22c55e'
            }}>
              {userStats?.currentlyReading || 0}
            </div>
            <p className="mb-0" style={{
              fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              color: 'var(--text-secondary)'
            }}>Currently Reading</p>
          </div>
        </div>
      </div>
      
      <div className="col-12 col-md-4 mb-3 mb-md-4">
        <div className="card border-0" style={{
          background: 'var(--bg-primary)',
          borderRadius: 'clamp(16px, 3vw, 20px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '2px solid var(--border-light)'
        }}>
          <div className="card-body text-center p-3 p-md-4">
            <div className="fw-bold mb-2" style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              color: '#f59e0b'
            }}>
              {userStats?.toRead || 0}
            </div>
            <p className="mb-0" style={{
              fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              color: 'var(--text-secondary)'
            }}>Want to Read</p>
          </div>
        </div>
      </div>

      {/* Reading Goal Progress */}
      {userStats?.readingGoalProgress && (
        <div className="col-12 mb-3 mb-md-4">
          <div className="card border-0" style={{
            background: 'var(--bg-primary)',
            borderRadius: 'clamp(16px, 3vw, 20px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '2px solid var(--border-light)'
          }}>
            <div className="card-body p-3 p-md-4">
              <h5 className="fw-bold mb-3" style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: 'var(--text-primary)'
              }}>
                <i className="bi bi-target me-2" style={{ color: 'var(--primary-color)' }}></i>
                Reading Goal Progress
              </h5>
              <div className="d-flex justify-content-between mb-2" style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {userStats.readingGoalProgress.current} of {userStats.readingGoalProgress.goal} books
                </span>
                <span className="fw-bold" style={{ color: 'var(--primary-color)' }}>
                  {userStats.readingGoalProgress.percentage}%
                </span>
              </div>
              <div className="progress" style={{
                height: 'clamp(8px, 1.5vw, 12px)',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)'
              }}>
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${userStats.readingGoalProgress.percentage}%`,
                    background: 'var(--gradient-primary)',
                    borderRadius: '8px',
                    transition: 'width 1s ease'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats Row */}
      <div className="col-12 col-md-6 mb-3 mb-md-4">
        <div className="card border-0" style={{
          background: 'var(--bg-primary)',
          borderRadius: 'clamp(16px, 3vw, 20px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '2px solid var(--border-light)'
        }}>
          <div className="card-body p-3 p-md-4">
            <h6 className="fw-bold mb-3" style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              color: 'var(--text-primary)'
            }}>
              <i className="bi bi-bar-chart me-2" style={{ color: 'var(--primary-color)' }}></i>
              Reading Statistics
            </h6>
            <div className="row text-center g-3">
              <div className="col-6">
                <div className="fw-bold mb-1" style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  color: '#06b6d4'
                }}>
                  {userStats?.averageRating?.toFixed(1) || '0.0'}
                </div>
                <small style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
                  Avg Rating
                </small>
              </div>
              <div className="col-6">
                <div className="fw-bold mb-1" style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  color: '#22c55e'
                }}>
                  {userStats?.currentStreak || 0}
                </div>
                <small style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
                  Day Streak
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="card-title">This Month</h6>
            <div className="row text-center">
              <div className="col-6">
                <div className="fw-bold text-primary">{userStats?.booksAddedThisMonth || 0}</div>
                <small className="text-muted">Books Added</small>
              </div>
              <div className="col-6">
                <div className="fw-bold text-warning">{userStats?.totalPagesRead || 0}</div>
                <small className="text-muted">Total Pages</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Genres */}
      {userStats?.favoriteGenres && userStats.favoriteGenres.length > 0 && (
        <div className="col-12 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Favorite Genres</h6>
              <div className="d-flex flex-wrap gap-2">
                {userStats.favoriteGenres.map((genreData, index) => (
                  <span key={index} className="badge bg-light text-dark">
                    {genreData.genre} ({genreData.count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activity</h5>
              <Link to="/library" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
          </div>
          <div className="card-body">
            {recentBooks.length > 0 ? (
              <div className="row">
                {recentBooks.map((userBook) => (
                  <div key={userBook.id} className="col-md-6 col-lg-4 mb-3">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div 
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ width: '50px', height: '60px' }}
                        >
                          <i className="bi bi-book text-muted"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1">{userBook.title || userBook.book?.title}</h6>
                        <p className="text-muted small mb-1">{userBook.author || userBook.book?.author}</p>
                        <span className={`badge ${
                          userBook.status === 'read' ? 'bg-success' :
                          userBook.status === 'currently-reading' ? 'bg-primary' :
                          'bg-secondary'
                        }`}>
                          {userBook.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-book display-1 text-muted"></i>
                <h5 className="mt-3">No books yet</h5>
                <p className="text-muted">Start adding books to your library to see them here!</p>
                <Link to="/books" className="btn btn-primary">
                  Discover Books
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// Stats Tab Component
const ProfileStatsTab: React.FC<{ userStats: UserStats | null }> = ({ userStats }) => {
  if (!userStats) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading stats...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent">
            <h5 className="mb-0">Favorite Genres</h5>
          </div>
          <div className="card-body">
            {userStats.favoriteGenres.map((genre) => (
              <div key={genre.genre} className="d-flex justify-content-between mb-2">
                <span>{genre.genre}</span>
                <span className="badge bg-primary">{genre.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent">
            <h5 className="mb-0">Reading Statistics</h5>
          </div>
          <div className="card-body">
            <div className="row text-center">
              <div className="col-6 mb-3">
                <div className="display-6 fw-bold text-primary">{userStats.averageRating}</div>
                <small className="text-muted">Average Rating</small>
              </div>
              <div className="col-6 mb-3">
                <div className="display-6 fw-bold text-success">{userStats.booksAddedThisMonth}</div>
                <small className="text-muted">Books This Month</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Profile Modal Component
const EditProfileModal: React.FC<{
  user: User;
  onSave: (data: Partial<User>) => Promise<void>;
  onClose: () => void;
}> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    readingGoal: user.readingGoal || 50,
    favoriteGenres: user.favoriteGenres || []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help', 'Poetry'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Call onSave which handles the profile update through AuthContext
      await onSave(formData);
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 1050
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px' }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: '30px',
            border: 'none',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Modal Header */}
            <div
              style={{
                background: 'var(--gradient-primary)',
                padding: '2rem 2.5rem',
                borderBottom: 'none'
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="fw-bold mb-0" style={{ color: 'white', fontSize: '1.75rem' }}>
                  <i className="bi bi-person-circle me-2"></i>
                  Edit Profile
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '12px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <i className="bi bi-x-lg" style={{ color: 'white', fontSize: '1.25rem' }}></i>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ padding: '2.5rem' }}>
              {error && (
                <div
                  className="alert mb-4"
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    color: 'var(--danger-color)',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '1rem 1.25rem'
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    DISPLAY NAME
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    maxLength={50}
                    required
                    style={{
                      padding: '0.875rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    LOCATION
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    style={{
                      padding: '0.875rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    BIO
                  </label>
                  <textarea
                    className="form-control"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    maxLength={500}
                    placeholder="Tell us about yourself..."
                    style={{
                      padding: '0.875rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '1rem',
                      resize: 'none'
                    }}
                  ></textarea>
                  <div className="form-text text-end" style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    {formData.bio.length}/500 characters
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    WEBSITE
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://your-website.com"
                    style={{
                      padding: '0.875rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    READING GOAL (BOOKS PER YEAR)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="readingGoal"
                    value={formData.readingGoal}
                    onChange={handleInputChange}
                    min="0"
                    max="1000"
                    style={{
                      padding: '0.875rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    FAVORITE GENRES
                  </label>
                  <div className="row g-2">
                    {genres.map(genre => (
                      <div key={genre} className="col-md-4 col-6">
                        <button
                          type="button"
                          onClick={() => handleGenreToggle(genre)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            border: formData.favoriteGenres.includes(genre)
                              ? 'none'
                              : '2px solid var(--border-color)',
                            background: formData.favoriteGenres.includes(genre)
                              ? 'var(--gradient-primary)'
                              : 'white',
                            color: formData.favoriteGenres.includes(genre)
                              ? 'white'
                              : 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          {formData.favoriteGenres.includes(genre) && (
                            <i className="bi bi-check2"></i>
                          )}
                          {genre}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.5rem 2.5rem 2.5rem', borderTop: '1px solid var(--border-light)' }}>
              <div className="d-flex gap-3 justify-content-end">
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '0.875rem 2rem',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.875rem 2rem',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2 me-2"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;