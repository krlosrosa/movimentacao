import { Button } from "@/_shared/_components/ui/button"
import { Input } from "@/_shared/_components/ui/input"
import { Card, CardContent } from "@/_shared/_components/ui/card"
import { MapPin, ScanBarcode } from "lucide-react"
import { useState } from "react"
import { Demanda } from "../store/demanda"
import toast from "react-hot-toast"

interface EnderecoDestinoProps {
  setTabSelect: (tab: string) => void
  demanda: Demanda
}

export default function EnderecoDestino({ setTabSelect, demanda }: EnderecoDestinoProps) {
  const [endereco, setEndereco] = useState("")
  const enderecoEsperado = demanda.destino
  
  const handleConfirmar = () => {
    if (!endereco) return
    
    if (endereco === enderecoEsperado) {
      setTabSelect('validacao')
    } else {
      toast.error('Endereço incorreto')
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
          <div className="bg-green-50 border-2 flex items-center justify-center border-green-200 rounded-lg p-2 text-center">
            <ScanBarcode className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-green-900">
              BIPE O ENDEREÇO DE DESTINO
            </p>
          </div>

          {/* Endereço Esperado */}
          <div className="bg-gray-900 text-white p-2 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
              <MapPin className="w-3 h-3" />
              ENDEREÇO ESPERADO
            </div>
            <div className="text-3xl font-black tracking-wider text-center">
              {enderecoEsperado}
            </div>
          </div>

          {/* Input de Bipagem */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Endereço Bipado
            </label>
            <Input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Bipe ou digite o endereço"
              className="h-12 text-lg font-bold text-center"
              autoFocus
            />
          </div>

          {/* Botão Confirmar */}
          <Button
            onClick={handleConfirmar}
            disabled={!endereco}
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 text-white shadow-lg active:scale-95 transition-transform"
          >
            CONFIRMAR DESTINO
          </Button>

          {/* Dica */}
          <div className="text-xs text-center text-gray-500 bg-gray-50 p-2 rounded">
            💡 Aponte o coletor para o código de barras do endereço de destino
          </div>
        </CardContent>
      </Card>
    </div>
  )
}