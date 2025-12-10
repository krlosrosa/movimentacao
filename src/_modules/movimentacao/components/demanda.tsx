import { Button } from "@/_shared/_components/ui/button"
import { Card, CardContent, CardHeader } from "@/_shared/_components/ui/card" 
import { Badge } from "@/_shared/_components/ui/badge" 
import { PlayCircle, CheckCircle, Clock, AlertCircle, Package, MapPin } from "lucide-react"
import { Skeleton } from "@/_shared/_components/ui/skeleton"
import { useEffect, useState } from "react"
import { Demanda } from "../store/demanda"

interface DemandaOperadorProps {
  setTabSelect: (tab: string) => void
  demanda: Demanda
}

export default function DemandaOperador({ setTabSelect, demanda }: DemandaOperadorProps) {
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (demanda) setStatus(demanda.status)
  }, [demanda])

  const handleAction = () => {
    setTabSelect('enderecoOrigem')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAction()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  const getPriorityColor = (prioridade: number) => {
    if (prioridade === 1) return "bg-red-500"
    if (prioridade === 2) return "bg-orange-500"
    return "bg-yellow-500"
  }

  const priorityColor = getPriorityColor(demanda.prioridade)

  return (
    <div className="min-h-screen bg-gray-100"> 
      <Card className="w-full max-w-md mx-auto shadow-lg p-1">

        <CardContent className="p-0 space-y-3">
          {/* Palete */}
          <div className="bg-gray-900 text-white p-3 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
              <Package className="w-3 h-3" />
              PALETE
            </div>
            <div className="text-sm font-mono font-bold tracking-tight break-all leading-relaxed">
              {demanda.palete}
            </div>
          </div>

          {/* Origem e Destino */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-lg">
              <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-1">
                <MapPin className="w-3 h-3" />
                ORIGEM
              </div>
              <div className="text-lg font-bold text-blue-900">{demanda.origem}</div>
            </div>
            
            <div className="bg-green-50 border-2 border-green-200 p-3 rounded-lg">
              <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mb-1">
                <MapPin className="w-3 h-3" />
                DESTINO
              </div>
              <div className="text-lg font-bold text-green-900">{demanda.destino}</div>
            </div>
          </div>

          {/* Produto */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-2 space-y-1">
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500 font-semibold">SKU</div>
              <div className="text-lg font-bold text-gray-900">{demanda.sku}</div>
            </div>
            
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500 font-semibold">DESCRIÇÃO</div>
              <div className="text-sm font-semibold text-gray-800 leading-tight">
                {demanda.descricao}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 font-semibold">LOTE</div>
              <div className="text-sm font-bold text-gray-900">{demanda.lote}</div>
            </div>
          </div>

          {/* Botão de Ação */}
          <Button
            onClick={handleAction}
            className={`w-full h-14 text-lg font-bold bg-blue-500 text-white shadow-lg active:scale-95 transition-transform`}
          >
            <PlayCircle className="w-4 h-4" />
            <span className="ml-2">Iniciar Movimentação</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}