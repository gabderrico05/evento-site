import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import FormularioResgate from './components/FormularioResgate'
import IngressoConfirmacao from './components/IngressoConfirmacao'
import Login from './components/Login'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/formulario" element={<FormularioResgate />} />
          <Route path="/cadastro" element={<FormularioResgate />} />
          <Route path="/ingresso" element={<IngressoConfirmacao />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
