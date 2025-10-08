import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LogIn } from 'lucide-react'
import '../App.css'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', senha: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Se já logado, ir direto para ingresso
    const participante = localStorage.getItem('participante')
    if (participante) navigate('/ingresso')
  }, [navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!formData.senha.trim()) newErrors.senha = 'Senha é obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim(), senha: formData.senha })
      })
      const data = await resp.json()
      if (!resp.ok) {
        setErrors({ submit: data.error || 'Falha no login' })
      } else {
        localStorage.setItem('participante', JSON.stringify(data))
        navigate('/ingresso')
      }
    } catch (err) {
      setErrors({ submit: 'Erro de conexão. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(189deg, #73276C 0%, #C44FB8 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6 text-white hover:bg-white/20">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-2xl p-8">
          <div className="flex items-center justify-center mb-4 text-[#73276C]">
            <LogIn className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">Entrar</h1>
          </div>
          <p className="text-center text-sm text-gray-600 mb-6">Acesse sua conta para visualizar seu ingresso</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#73276C] font-medium">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`mt-1 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="Digite seu email" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="senha" className="text-[#73276C] font-medium">Senha *</Label>
              <Input id="senha" type="password" value={formData.senha} onChange={(e) => handleInputChange('senha', e.target.value)} className={`mt-1 ${errors.senha ? 'border-red-500' : 'border-gray-300'}`} placeholder="Digite sua senha" />
              {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
            </div>
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
            <Button type="submit" disabled={isLoading} className="w-full bg-[#73276C] hover:bg-[#5a1e55] text-white py-3 text-lg font-semibold transition-all duration-300">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <p className="text-center text-sm text-gray-600">Não possui conta? <button type="button" onClick={() => navigate('/cadastro')} className="text-[#73276C] font-medium hover:underline">Cadastre-se aqui</button></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
