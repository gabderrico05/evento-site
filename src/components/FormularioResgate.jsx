import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import '../App.css'

function FormularioResgate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    senha: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '')
    if (cleanCPF.length !== 11) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false
    
    // Validação dos dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false
    
    return true
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '')
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
  }

  const formatCPF = (value) => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value) => {
    const cleanValue = value.replace(/\D/g, '')
    if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (field === 'telefone') {
      formattedValue = formatPhone(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido'
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório'
    } else if (!validatePhone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido'
    }
    
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória'
    } else if (formData.senha.trim().length < 4) {
      newErrors.senha = 'Senha deve ter pelo menos 4 caracteres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/resgatar-ingresso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          cpf: formData.cpf.replace(/\D/g, ''),
          telefone: formData.telefone.replace(/\D/g, ''),
          senha: formData.senha.trim()
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        // Salvar participante em sessão local e redirecionar para ingresso
        localStorage.setItem('participante', JSON.stringify(result))
        navigate('/ingresso')
      } else {
        const error = await response.json()
        setErrors({ submit: error.error || error.message || 'Erro ao resgatar ingresso' })
      }
    } catch (error) {
      setErrors({ submit: 'Erro de conexão. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen" 
         style={{
           background: 'linear-gradient(189deg, #73276C 0%, #C44FB8 100%)'
         }}>
      <div className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 text-white hover:bg-white/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        {/* Formulário */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-[#73276C] text-center mb-2">
            Cadastro
          </h1>
          <p className="text-center text-sm text-gray-600 mb-4">Crie sua conta para resgatar seu ingresso</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome" className="text-[#73276C] font-medium">
                Nome Completo *
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={`mt-1 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Digite seu nome completo"
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email" className="text-[#73276C] font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Digite seu email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="cpf" className="text-[#73276C] font-medium">
                CPF *
              </Label>
              <Input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                className={`mt-1 ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="telefone" className="text-[#73276C] font-medium">
                Telefone *
              </Label>
              <Input
                id="telefone"
                type="text"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className={`mt-1 ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
              {errors.telefone && (
                <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="senha" className="text-[#73276C] font-medium">
                Senha *
              </Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                className={`mt-1 ${errors.senha ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Crie uma senha"
              />
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
              )}
            </div>
            
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#73276C] hover:bg-[#5a1e55] text-white py-3 text-lg font-semibold transition-all duration-300"
            >
              {isLoading ? 'Processando...' : 'Cadastrar e Resgatar'}
            </Button>

            <p className="text-center text-sm text-gray-600">Já possui conta? <button type="button" onClick={() => navigate('/login')} className="text-[#73276C] font-medium hover:underline">Entrar</button></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormularioResgate
