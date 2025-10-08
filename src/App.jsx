import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'
import HomePage from './components/HomePage'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import FormularioResgate from './components/FormularioResgate'
import IngressoConfirmacao from './components/IngressoConfirmacao'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/formulario" element={
              <ProtectedRoute>
                <FormularioResgate />
              </ProtectedRoute>
            } />
            <Route path="/ingresso" element={
              <ProtectedRoute>
                <IngressoConfirmacao />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
