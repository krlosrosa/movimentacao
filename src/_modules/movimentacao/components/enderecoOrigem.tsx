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
    
    if (endereco === enderecoEsperado) {
      setTabSelect('sscc')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-4 space-y-4">
          {/* Instrução */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
            <ScanBarcode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-blue-900">
              BIPE O ENDEREÇO DE ORIGEM
            </p>
          </div>

          {/* Endereço Esperado */}
          <div className="bg-gray-900 text-white p-4 rounded-lg">
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