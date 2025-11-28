import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { ArrowLeft, Download } from 'lucide-react'
import ParticipanteDados from './ParticipanteDados.jsx'
import '../App.css'

/**
 * Exemplo de uso do componente ParticipanteDados
 * Demonstra como exibir dados do participante com proteção XSS automática
 */
function ExemploParticipante() {
  const navigate = useNavigate()
  const [participante, setParticipante] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar dados do participante do localStorage ou API
    const dadosParticipante = localStorage.getItem('participante')
    
    if (dadosParticipante) {
      try {
        const dados = JSON.parse(dadosParticipante)
        setParticipante(dados)
      } catch (error) {
        console.error('Erro ao carregar dados do participante:', error)
      }
    }
    
    setLoading(false)
  }, [])

  const handleDownloadIngresso = () => {
    // Implementar lógica de download do ingresso
    console.log('Download do ingresso:', participante?.numeroIngresso)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#73276C] to-[#C44FB8]">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!participante) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#73276C] to-[#C44FB8]">
        <div className="text-white text-xl mb-4">Nenhum participante encontrado</div>
        <Button
          onClick={() => navigate('/cadastro')}
          className="bg-white text-[#73276C] hover:bg-gray-100"
        >
          Ir para Cadastro
        </Button>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        background: 'linear-gradient(189deg, #73276C 0%, #C44FB8 100%)'
      }}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Botão Voltar */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 text-white hover:bg-white/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Título da Página */}
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Seu Ingresso
        </h1>

        {/* Componente ParticipanteDados com proteção XSS */}
        <ParticipanteDados
          nome={participante.nome}
          email={participante.email}
          numeroIngresso={participante.numeroIngresso}
        />

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            onClick={handleDownloadIngresso}
            className="bg-white text-[#73276C] hover:bg-gray-100 border-2 border-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Ingresso
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#73276C]"
          >
            Voltar para Início
          </Button>
        </div>

        {/* Informações de Segurança */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            ℹ️ Informações Importantes
          </h2>
          <ul className="text-white space-y-2 text-sm">
            <li>• Guarde seu número de ingresso com segurança</li>
            <li>• Apresente este ingresso na entrada do evento</li>
            <li>• Em caso de dúvidas, entre em contato com o suporte</li>
            <li>
              • <strong>Segurança:</strong> Todos os dados são protegidos contra XSS 
              através do escaping automático do React
            </li>
          </ul>
        </div>

        {/* Demonstração de proteção XSS */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔒 Proteção XSS Demonstrada
          </h3>
          <p className="text-sm text-yellow-700 mb-2">
            Mesmo que os dados contenham código malicioso como{' '}
            <code className="bg-yellow-100 px-1 rounded">
              &lt;script&gt;alert('XSS')&lt;/script&gt;
            </code>
            , o React automaticamente escapa esses valores, renderizando-os como texto puro 
            em vez de executá-los como código HTML/JavaScript.
          </p>
          <p className="text-xs text-yellow-600">
            <strong>Exemplo:</strong> Se o nome fosse "{`<img src=x onerror=alert('XSS')>`}", 
            seria exibido como texto literal, não como uma tag HTML executável.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExemploParticipante
