'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Forklift, 
  ClipboardCheck,
  Clock,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Truck,
  Boxes
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  // Atualizar hora
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Verificar conexão
  useEffect(() => {
    const checkConnection = () => {
      setIsOnline(navigator.onLine);
    };
    
    checkConnection();
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  const opcoesMenu = [
    {
      id: 'movimentacao',
      titulo: 'MOVIMENTAÇÃO',
      descricao: 'Ressuprimento de estoque',
      icon: Truck,
      subIcon: Forklift,
      cor: 'bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 active:from-blue-800 active:to-blue-900',
      acao: () => router.push('/demanda')
    },
    {
      id: 'contagem',
      titulo: 'CONTAGEM',
      descricao: 'Inventário e conferência',
      icon: Boxes,
      subIcon: ClipboardCheck,
      cor: 'bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 active:from-green-800 active:to-green-900',
      acao: () => router.push('/contagem')
    }
  ];

  const handleSelect = (opcao: any) => {
    setSelectedOption(opcao.id);
    // Feedback tátil (vibração se disponível)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Pequeno delay para feedback visual
    setTimeout(() => {
      opcao.acao();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 p-4 font-sans">
      {/* Título principal */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
          CONTROLE DE ESTOQUE
        </h1>
        <div className="flex items-center justify-center gap-4 text-white/70">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Operacional</span>
          </div>
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Wifi className={`w-5 h-5 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
            <span>{isOnline ? 'Conectado' : 'Sem conexão'}</span>
          </div>
        </div>
      </div>

      {/* Grid de opções - Layout otimizado para coletor */}
      <div className="max-w-md mx-auto space-y-6">
        {opcoesMenu.map((opcao) => (
          <button
            key={opcao.id}
            onClick={() => handleSelect(opcao)}
            className={`w-full ${opcao.cor} rounded-3xl shadow-2xl transition-all duration-200 
              ${selectedOption === opcao.id ? 'transform scale-95 ring-4 ring-white/40' : 'hover:shadow-3xl hover:scale-[1.02]'}
              active:scale-95`}
            style={{ 
              minHeight: '180px',
              touchAction: 'manipulation'
            }}
          >
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <opcao.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-3xl font-black text-white tracking-wide">
                        {opcao.titulo}
                      </h2>
                      <p className="text-white/80 mt-1 text-lg">
                        {opcao.descricao}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white/20 rounded-full">
                  <opcao.subIcon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Indicador visual */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium">
                    Toque para iniciar
                  </span>
                </div>
                <div className="text-white/70 text-right">
                  <div className="text-xs">→</div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Instruções */}
      <div className="mt-8 text-center max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-white/60 text-sm">
            Selecione uma operação para continuar
          </span>
        </div>
      </div>
    </div>
  );
}