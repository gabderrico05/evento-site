import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import '../App.css'

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/formulario')
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar erro específico quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Limpar erro geral de login
    if (loginError) {
      setLoginError('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.login.trim()) {
      newErrors.login = 'Email ou nome de usuário é obrigatório'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setLoginError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Usar o hook de autenticação
        login(data.user, data.token)
        
        // Redirecionar para a página principal ou dashboard
        navigate('/formulario')
      } else {
        setLoginError(data.message || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      setLoginError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(189deg, #73276C 0%, #C44FB8 100%)'
      }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Header com botão voltar */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h1 className="text-2xl font-bold text-[#73276C] ml-2">Login</h1>
        </div>

        {/* Erro geral de login */}
        {loginError && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {loginError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Login (Email ou Username) */}
          <div className="space-y-2">
            <Label htmlFor="login" className="text-sm font-medium text-gray-700">
              Email ou Nome de Usuário
            </Label>
            <Input
              id="login"
              name="login"
              type="text"
              value={formData.login}
              onChange={handleInputChange}
              className={`w-full ${errors.login ? 'border-red-500' : ''}`}
              placeholder="Digite seu email ou nome de usuário"
            />
            {errors.login && (
              <p className="text-red-500 text-sm">{errors.login}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Botão de Login */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#73276C] hover:bg-[#5a1d54] text-white py-2 px-4 rounded-md transition-colors duration-300"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Link para cadastro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não possui login?{' '}
            <Link 
              to="/cadastro" 
              className="text-[#73276C] hover:text-[#5a1d54] font-medium underline"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login