import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Calendar, MapPin, Clock, User, Mail, Phone, Hash } from 'lucide-react'
import '../App.css'

function IngressoConfirmacao() {
  const navigate = useNavigate()
  const [participante, setParticipante] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('participante')
    if (stored) {
      setParticipante(JSON.parse(stored))
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleConfirmar = () => {
    localStorage.removeItem('participante')
    navigate('/')
  }

  if (!participante) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{
             background: 'linear-gradient(189deg, #73276C 0%, #C44FB8 100%)'
           }}>
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8"
         style={{
           background: 'linear-gradient(189deg, #73276C 0%, #C44FB8 100%)'
         }}>
      <div className="container mx-auto px-4">
        {/* Mensagem de Sucesso */}
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Ingresso Resgatado com Sucesso!
          </h1>
          <p className="text-white/80 text-lg">
            Seu ingresso foi gerado e está pronto para uso
          </p>
        </div>

        {/* Ingresso */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header do Ingresso */}
          <div className="bg-gradient-to-r from-[#73276C] to-[#C44FB8] p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">EVENTO ESPECIAL 2025</h2>
                <p className="text-white/90">Uma experiência única e inesquecível</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-lg p-3">
                  <Hash className="h-6 w-6 mb-1" />
                  <div className="text-sm font-mono">{participante.numeroIngresso}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Evento */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#73276C] mb-4">Detalhes do Evento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-[#73276C]" />
                <div>
                  <div className="font-medium">Data</div>
                  <div className="text-gray-600">15 de Dezembro, 2025</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#73276C]" />
                <div>
                  <div className="font-medium">Horário</div>
                  <div className="text-gray-600">19:00 - 23:00</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-[#73276C]" />
                <div>
                  <div className="font-medium">Local</div>
                  <div className="text-gray-600">Centro de Convenções - Av. Principal, 1000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Participante */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#73276C] mb-4">Dados do Participante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-[#73276C]" />
                <div>
                  <div className="font-medium">Nome</div>
                  <div className="text-gray-600">{participante.nome}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#73276C]" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600">{participante.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#73276C]" />
                <div>
                  <div className="font-medium">Telefone</div>
                  <div className="text-gray-600">{participante.telefone}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Hash className="h-5 w-5 text-[#73276C]" />
                <div>
                  <div className="font-medium">CPF</div>
                  <div className="text-gray-600">{participante.cpfFormatado}</div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code e Instruções */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-xs mb-1">QR CODE</div>
                    <div className="text-2xl">⬜</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-semibold text-[#73276C] mb-2">Instruções Importantes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Apresente este ingresso na entrada do evento</li>
                  <li>• Chegue com 30 minutos de antecedência</li>
                  <li>• Traga um documento de identificação</li>
                  <li>• O ingresso é pessoal e intransferível</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rodapé do Ingresso */}
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500">Ingresso válido apenas para a data especificada</p>
          </div>
        </div>

        {/* Botão de Confirmação */}
        <div className="text-center mt-8">
          <Button
            onClick={handleConfirmar}
            className="bg-white text-[#73276C] hover:bg-gray-100 px-8 py-3 text-lg font-semibold border-2 border-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}

export default IngressoConfirmacao
