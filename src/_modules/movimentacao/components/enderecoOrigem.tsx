import { Button } from "@/_shared/_components/ui/button"
import { Input } from "@/_shared/_components/ui/input"
import { Card, CardContent } from "@/_shared/_components/ui/card"
import { MapPin, ScanBarcode } from "lucide-react"
import { useState } from "react"
import { Demanda } from "../store/demanda"
import useRegisterAnomalia from "../hooks/useRegisterAnomalia"
import ModalValidarAnomalia from "./modalValidarAnomaliar"

interface EnderecoOrigemProps {
  setTabSelect: (tab: string) => void
  demanda: Demanda
}

export default function EnderecoOrigem({ setTabSelect, demanda }: EnderecoOrigemProps) {
  const [endereco, setEndereco] = useState("")
  const { handleRegisterAnomalia, isPending, error } = useRegisterAnomalia()


  const [isOpen, setIsOpen] = useState(false)

  const handleValidarAnomalia = () => {
    handleRegisterAnomalia(demanda.idMov)
    setTabSelect('demanda')
    setIsOpen(false)
  }

  const enderecoEsperado = demanda.origem
  
  const handleConfirmar = () => {
    if (!endereco) return
    
    if (endereco.toUpperCase().slice(0, 10) === enderecoEsperado.toUpperCase().slice(0, 10)) {
      setTabSelect('sscc')
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
          <div className="bg-blue-50 border-2 flex items-center justify-center border-blue-200 rounded-lg p-2 text-center">
            <ScanBarcode className="w-8 h-8 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-bold text-blue-900">
              BIPE O ENDEREÇO DE ORIGEM
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
          <div className="space-y-1">
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
            CONFIRMAR ENDEREÇO
          </Button>
          <ModalValidarAnomalia
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onValidarAnomalia={handleValidarAnomalia}
          />

          {/* Dica */}
          <div className="text-xs text-center text-gray-500 bg-gray-50 p-2 rounded">
            💡 Aponte o coletor para o código de barras do endereço
          </div>
        </CardContent>
      </Card>
    </div>
  )
}