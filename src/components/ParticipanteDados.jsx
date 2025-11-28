import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { User, Mail, Ticket } from 'lucide-react'
import PropTypes from 'prop-types'

/**
 * Componente para exibir dados do participante com proteção contra XSS.
 * 
 * React automaticamente faz HTML escaping de todos os valores renderizados em JSX,
 * prevenindo ataques XSS. Nunca use dangerouslySetInnerHTML a menos que seja
 * absolutamente necessário e o conteúdo seja sanitizado.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.nome - Nome do participante
 * @param {string} props.email - Email do participante
 * @param {string} props.numeroIngresso - Número do ingresso
 */
function ParticipanteDados({ nome, email, numeroIngresso }) {
  // React automaticamente escapa esses valores quando renderizados em JSX
  // Exemplo: "<script>alert('XSS')</script>" será renderizado como texto, não executado
  
  // Sanitização adicional: remover espaços extras e validar tipos
  const nomeSeguro = String(nome || '').trim()
  const emailSeguro = String(email || '').trim()
  const numeroIngressoSeguro = String(numeroIngresso || '').trim()

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-2 border-[#73276C]/20">
      <CardHeader className="bg-gradient-to-r from-[#73276C] to-[#C44FB8] text-white">
        <CardTitle className="text-2xl font-bold text-center">
          Dados do Participante
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Nome do Participante */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="mt-1">
            <User className="h-5 w-5 text-[#73276C]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Nome Completo</p>
            {/* React escapa automaticamente o valor de nomeSeguro */}
            <p className="text-lg font-semibold text-gray-900 break-words">
              {nomeSeguro || 'Não informado'}
            </p>
          </div>
        </div>

        {/* Email do Participante */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="mt-1">
            <Mail className="h-5 w-5 text-[#73276C]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
            {/* React escapa automaticamente o valor de emailSeguro */}
            <p className="text-lg font-semibold text-gray-900 break-all">
              {emailSeguro || 'Não informado'}
            </p>
          </div>
        </div>

        {/* Número do Ingresso */}
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#73276C]/5 to-[#C44FB8]/5 rounded-lg border-2 border-[#73276C]/20">
          <div className="mt-1">
            <Ticket className="h-5 w-5 text-[#73276C]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Número do Ingresso</p>
            {/* React escapa automaticamente o valor de numeroIngressoSeguro */}
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-[#73276C] font-mono tracking-wider">
                {numeroIngressoSeguro || 'Não disponível'}
              </p>
              {numeroIngressoSeguro && (
                <Badge variant="outline" className="bg-[#73276C] text-white border-[#73276C]">
                  Confirmado
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Aviso de segurança */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>🔒 Proteção XSS:</strong> Todos os dados são automaticamente escapados pelo React 
            para prevenir ataques de Cross-Site Scripting (XSS).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Validação de props com PropTypes
ParticipanteDados.propTypes = {
  nome: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  numeroIngresso: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
}

export default ParticipanteDados
