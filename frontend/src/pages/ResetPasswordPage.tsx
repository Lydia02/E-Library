import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid or missing reset token');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword: formData.newPassword
      });

      setMessage(response.data.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successfully. Please login with your new password.' }
        });
      }, 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-vh-100 d-flex align-items-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-sm border-0">
                <div className="card-body p-5 text-center">
                  <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                  <h2 className="fw-bold mt-3 mb-3">Invalid Reset Link</h2>
                  <p className="text-muted mb-4">
                    The password reset link is invalid or has expired.
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <Link to="/forgot-password" className="btn btn-primary">
                      Request New Link
                    </Link>
                    <Link to="/login" className="btn btn-outline-secondary">
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div 
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'var(--gradient-primary)',
                    }}
                  >
                    <i className="bi bi-shield-lock-fill text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h2 className="fw-bold">Reset Password</h2>
                  <p className="text-muted">
                    Create a new password for your account.
                  </p>
                </div>

                {message && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {message}
                    <div className="mt-2">
                      <small>Redirecting to login page...</small>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label fw-semibold">
                      New Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting || !!message}
                        minLength={6}
                      />
                    </div>
                    <div className="form-text">Password must be at least 6 characters long.</div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting || !!message}
                      />
                    </div>
                  </div>

                  <div className="d-grid mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={isSubmitting || !!message}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                          Resetting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Reset Password
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="mb-0">
                    Remember your password?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Back to Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;