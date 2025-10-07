
import { Button } from '@/components/ui/button.jsx'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import confeteImg from '../assets/confete.png';
import mcgorila from '../assets/mcgorila.png';

function HomePage() {
  const navigate = useNavigate()

  const handleResgatarIngresso = () => {
    navigate('/formulario')
  }

  return (
    <div className="w-full h-screen items-center justify-center " 
         style={{
           background: 'linear-gradient(189deg, #73276C 0%, #C44FB8 100%)'
         }}>
      {/* Imagem de fundo principal */}
      <img 
        className="w-full h-[592px] absolute top-0 left-0 object-cover"
        src={confeteImg}
        alt="Confete"
      />
      
      {/* Imagem secundária sobreposta */}
      <img 
        className="w-[1100px] h-[400px] absolute left-[170px] top-[190px] object-cover "
        src={mcgorila}
      />
      
      {/* Botão Resgatar Ingresso */}
      <div className=" flex h-full items-end justify-center pb-20">
        <Button
          onClick={handleResgatarIngresso}
          className="px-7 pt-3 pb-4 bg-white text-[#73276C] border-2 border-[#73276C] rounded-[5px] hover:bg-[#73276C] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          style={{
            fontSize: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '700',
            textAlign: 'center'
          }}
        >
          Resgatar ingresso
        </Button>
      </div>
      

    </div>
  )
}

export default HomePage
