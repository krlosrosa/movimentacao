import { Button } from "@/_shared/_components/ui/button"
import { Input } from "@/_shared/_components/ui/input"
import { Card, CardContent } from "@/_shared/_components/ui/card"
import { Package, ScanBarcode } from "lucide-react"
import { useState } from "react"
import { Demanda } from "../store/demanda"

interface SSCCProps {
  setTabSelect: (tab: string) => void
  demanda: Demanda
}

export default function SSCC({ setTabSelect, demanda }: SSCCProps) {
  const [sscc, setSscc] = useState("")
  const ssccEsperado = demanda.palete
  
  const handleConfirmar = () => {
    if (!sscc) return
    
    if (sscc === ssccEsperado) {
      setTabSelect('enderecoDestino')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleConfirmar()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-auto shadow-lg p-1">
        <CardContent className="p-4 space-y-2">
          {/* Instrução */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
            <ScanBarcode className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-purple-900">
              BIPE O SSCC DO PALETE
            </p>
          </div>

          {/* SSCC Esperado */}
          <div className="bg-gray-900 text-white p-2 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
              <Package className="w-3 h-3" />
              SSCC ESPERADO
            </div>
            <div className="text-sm font-mono font-bold tracking-tight break-all leading-relaxed">
              {ssccEsperado}
            </div>
          </div>

          {/* Input de Bipagem */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              SSCC Bipado
            </label>
            <Input
              value={sscc}
              onChange={(e) => setSscc(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Bipe ou digite o SSCC"
              className="h-12 text-sm font-mono text-center"
              autoFocus
            />
          </div>

          {/* Botão Confirmar */}
          <Button
            onClick={handleConfirmar}
            disabled={!sscc}
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 text-white shadow-lg active:scale-95 transition-transform"
          >
            CONFIRMAR SSCC
          </Button>

          {/* Dica */}
          <div className="text-xs text-center text-gray-500 bg-gray-50 p-2 rounded">
            💡 Aponte o coletor para o código de barras do palete
          </div>
        </CardContent>
      </Card>
    </div>
  )
}