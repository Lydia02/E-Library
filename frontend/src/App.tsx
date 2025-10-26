import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <div className="welcome-section">
          <h1>Welcome to E-Library</h1>
          <p>Your Personal Reading Companion</p>
          <p className="setup-message">
            Authentication system ready. Next: Layout components and pages.
          </p>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App
