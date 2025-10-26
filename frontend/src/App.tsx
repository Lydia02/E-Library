import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <ThemeToggle />
        <div style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={
              <div className="app-container">
                <div className="welcome-section">
                  <h1>Welcome to E-Library</h1>
                  <p>Your Personal Reading Companion</p>
                  <p className="setup-message">
                    Authentication pages ready! Login, Signup, and Password Reset implemented.
                  </p>
                </div>
              </div>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </Router>
  )
}

export default App
