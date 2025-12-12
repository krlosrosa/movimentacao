import { useState } from "react"
import { Card, CardContent } from "@/_shared/_components/ui/card"
import { Button } from "@/_shared/_components/ui/button"
import { Label } from "@/_shared/_components/ui/label"
import { Input } from "@/_shared/_components/ui/input" 
import { X } from "lucide-react"
import { ValidacaoContagemLite } from "../types/validacao-contatem-lite"
import useValidarContagem from "../hooks/useValidarContagem"

export type FormData = {
  endereco: string
  sku: string
  lote: string
  caixas: number
  peso: number
}

export type ModalEdicaoProps = {
  validacao: ValidacaoContagemLite
  onCancelar: () => void
}

export default function ModalEdicao({ 
  validacao, 
  onCancelar,
  setModoEdicao,
}: {
  validacao: any
  onCancelar: () => void
  setModoEdicao: (value: boolean) => void
}) {
  const { handleAddAnomaliaContagemLite } = useValidarContagem()
  const [formData, setFormData] = useState({
    endereco: validacao.endereco,
    sku: '',
    lote: '',
    caixas: '',
    peso: ''
  })

  const handleSalvar = () => {
    handleAddAnomaliaContagemLite(validacao.endereco, {
      sku: formData.sku,
      lote: formData.lote,
      caixas: Number(formData.caixas) || 0,
      peso: Number(formData.peso) || 0
    })
    setModoEdicao(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">Validação #{validacao.id}</h3>
              <p className="text-sm text-gray-600 mt-1">Endereço: {validacao.endereco}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancelar}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="sku" className="text-base font-semibold mb-2 block">
                SKU
              </Label>
              <Input
                id="sku"
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="h-12 text-lg"
                placeholder="Digite o SKU"
              />
            </div>

            <div>
              <Label htmlFor="lote" className="text-base font-semibold mb-2 block">
                Lote
              </Label>
              <Input
                id="lote"
                type="text"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                className="h-12 text-lg"
                placeholder="Digite o lote"
              />
            </div>

            <div>
              <Label htmlFor="caixas" className="text-base font-semibold mb-2 block">
                Quantidade de Caixas
              </Label>
              <Input
                id="caixas"
                type="number"
                value={formData.caixas}
                onChange={(e) => setFormData({ ...formData, caixas: e.target.value })}
                className="h-12 text-lg"
                placeholder="0"
                inputMode="numeric"
              />
            </div>

            <div>
              <Label htmlFor="peso" className="text-base font-semibold mb-2 block">
                Peso (kg)
              </Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                className="h-12 text-lg"
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onCancelar} 
                className="flex-1 h-12 text-base"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSalvar} 
                className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700"
              >
                Salvar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}