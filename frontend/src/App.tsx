import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import HomePage from './pages/HomePage'
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
            <Route path="/" element={<HomePage />} />
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
