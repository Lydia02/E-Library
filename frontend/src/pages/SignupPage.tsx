import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/books');
    } catch (error) {
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        {/* Left Side - Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-3 p-md-4 order-2 order-lg-1">
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <div className="mb-4 mb-md-5">
              <Link to="/" className="text-decoration-none d-flex align-items-center mb-3 mb-md-4">
                <i className="bi bi-arrow-left me-2" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--text-primary)' }}></i>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Back to Home</span>
              </Link>
              <h2 className="fw-bold mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: 'var(--text-primary)' }}>
                Create Account
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>
                Join thousands of book lovers today
              </p>
            </div>

            {errors.general && (
              <div className="alert alert-danger mb-4" role="alert" style={{
                borderRadius: '15px',
                border: 'none',
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--danger-color)'
              }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-bold mb-2" style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    padding: '0.875rem 1.25rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    fontSize: '1rem'
                  }}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-bold mb-2" style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    padding: '0.875rem 1.25rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    fontSize: '1rem'
                  }}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-bold mb-2" style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}>
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      padding: '0.875rem 1.25rem',
                      paddingRight: '3rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="button"
                    className="btn position-absolute"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      padding: '0.5rem'
                    }}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  Must be at least 6 characters
                </small>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label fw-bold mb-2" style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}>
                  Confirm Password
                </label>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      padding: '0.875rem 1.25rem',
                      paddingRight: '3rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="button"
                    className="btn position-absolute"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      padding: '0.5rem'
                    }}
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 btn-lg mb-4"
                disabled={loading}
                style={{
                  background: 'var(--gradient-secondary)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  border: 'none',
                  fontSize: '1.05rem',
                  boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center">
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    fontWeight: '700'
                  }}>
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="col-lg-6 d-none d-lg-block position-relative order-1 order-lg-2" style={{
          background: 'var(--gradient-sunset)',
          overflow: 'hidden'
        }}>
          <div className="position-absolute w-100 h-100" style={{
            background: 'radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
            zIndex: 0
          }}></div>
          <div className="position-relative h-100 d-flex flex-column justify-content-center align-items-center p-5" style={{ zIndex: 1 }}>
            <div className="text-center text-white">
              <i className="bi bi-journals float-animation" style={{ fontSize: '8rem', opacity: 0.9 }}></i>
              <h1 className="display-4 fw-bold mt-4 mb-3">Start Your Journey</h1>
              <p className="lead" style={{ maxWidth: '450px', margin: '0 auto', fontSize: '1.2rem', opacity: 0.95 }}>
                Join our community of passionate readers and discover your next favorite book.
              </p>
              <div className="mt-5">
                <div className="row g-3 text-white">
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-center p-3" style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '15px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <i className="bi bi-check-circle-fill me-3" style={{ fontSize: '1.5rem' }}></i>
                      <span style={{ fontSize: '1.1rem' }}>Access 5,000+ curated books</span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-center p-3" style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '15px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <i className="bi bi-check-circle-fill me-3" style={{ fontSize: '1.5rem' }}></i>
                      <span style={{ fontSize: '1.1rem' }}>Personalized recommendations</span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-center p-3" style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '15px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <i className="bi bi-check-circle-fill me-3" style={{ fontSize: '1.5rem' }}></i>
                      <span style={{ fontSize: '1.1rem' }}>Track your reading progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
