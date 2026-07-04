import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import { ProtectedRoute } from './features/auth/components/ProtectedRoute'
import { LoginPage } from './features/auth/pages/LoginPage'
import { RegisterPage } from './features/auth/pages/RegisterPage'
import { ProvidersPage } from './features/providers/ProvidersPage'
import './App.css'
import { useState } from 'react'

function Dashboard() {
  const [count, setCount] = useState(0)
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-400 mb-8">You are securely logged in.</p>
      <button 
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/providers" element={<ProvidersPage />} />
            {/* Add more protected routes here */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
