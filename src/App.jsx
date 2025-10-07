import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import FormularioResgate from './components/FormularioResgate'
import IngressoConfirmacao from './components/IngressoConfirmacao'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/formulario" element={<FormularioResgate />} />
          <Route path="/ingresso" element={<IngressoConfirmacao />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
