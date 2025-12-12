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
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 p-3 font-sans">
      {/* Título principal */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
          CONTROLE DE ESTOQUE
        </h1>
      </div>

      {/* Grid de opções - Layout otimizado para coletor */}
      <div className="max-w-sm mx-auto space-y-4">
        {opcoesMenu.map((opcao) => (
          <button
            key={opcao.id}
            onClick={() => handleSelect(opcao)}
            className={`w-full ${opcao.cor} rounded-2xl shadow-xl transition-all duration-200 
              ${selectedOption === opcao.id ? 'transform scale-95 ring-4 ring-white/40' : 'hover:shadow-2xl hover:scale-[1.02]'}
              active:scale-95`}
            style={{ 
              minHeight: '140px',
              touchAction: 'manipulation'
            }}
          >
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <opcao.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-black text-white tracking-wide">
                        {opcao.titulo}
                      </h2>
                      <p className="text-white/80 mt-0.5 text-sm">
                        {opcao.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicador visual */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs font-medium">
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
      <div className="mt-6 text-center max-w-sm mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 rounded-full">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-white/60 text-xs">
            Selecione uma operação para continuar
          </span>
        </div>
      </div>
    </div>
  );
}