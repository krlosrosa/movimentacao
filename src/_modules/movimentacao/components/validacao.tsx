import { Button } from "@/_shared/_components/ui/button"
import { Card, CardContent } from "@/_shared/_components/ui/card"  
import { CheckCircle, Package, MapPin, ScanBarcode } from "lucide-react"
import { useState } from "react"
import { Demanda } from "../store/demanda"
import useValidateDemanda from "../hooks/useValidateDemanda"

interface ValidacaoProps {
  setTabSelect: (tab: string) => void
  demanda: Demanda
}

export default function Validacao({ setTabSelect, demanda }: ValidacaoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { validateDemanda, isPending, error } = useValidateDemanda()
  
  const handleConcluir = async () => {
    setIsLoading(true)
    
    try {
      await validateDemanda(demanda.idMov.toString())
      setTabSelect('demanda')
    } catch (error) {
      console.error("Erro ao concluir demanda:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-4 space-y-4">
          {/* Header de Sucesso */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <h2 className="text-lg font-bold text-green-900">
              VALIDAR MOVIMENTAÇÃO
            </h2>
            <p className="text-xs text-green-700 mt-1">
              Confira os dados antes de concluir
            </p>
          </div>

          {/* Demanda */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 font-semibold mb-1">DEMANDA</div>
            <div className="text-lg font-bold text-gray-900">#{demanda.idMov}</div>
          </div>

          {/* SSCC/Palete */}
          <div className="bg-gray-900 text-white p-3 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
              <Package className="w-3 h-3" />
              PALETE (SSCC)
            </div>
            <div className="text-xs font-mono font-bold tracking-tight break-all leading-relaxed">
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
              <div className="text-xl font-bold text-blue-900">{demanda.origem}</div>
            </div>
            
            <div className="bg-green-50 border-2 border-green-200 p-3 rounded-lg">
              <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mb-1">
                <MapPin className="w-3 h-3" />
                DESTINO
              </div>
              <div className="text-xl font-bold text-green-900">{demanda.destino}</div>
            </div>
          </div>

          {/* Produto */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-3 space-y-2">
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500 font-semibold">SKU</div>
              <div className="text-base font-bold text-gray-900">{demanda.sku}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 font-semibold">DESCRIÇÃO</div>
              <div className="text-sm font-semibold text-gray-800 leading-tight">
                {demanda.descricao}
              </div>
            </div>
          </div>

          {/* Botão Concluir */}
          <Button
            onClick={handleConcluir}
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 text-white shadow-lg active:scale-95 transition-transform"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                PROCESSANDO...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                CONCLUIR DEMANDA
              </>
            )}
          </Button>

          {/* Aviso */}
          <div className="text-xs text-center text-gray-500 bg-yellow-50 border border-yellow-200 p-2 rounded">
            ⚠️ Certifique-se de que o palete está no destino correto
          </div>
        </CardContent>
      </Card>
    </div>
  )
}