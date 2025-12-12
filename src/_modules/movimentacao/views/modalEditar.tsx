import { useState, useEffect } from "react"
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

  // Focar no primeiro input automaticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      const skuInput = document.getElementById('sku')
      skuInput?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSalvar = () => {
    handleAddAnomaliaContagemLite(validacao.endereco, {
      sku: formData.sku,
      lote: formData.lote,
      caixas: Number(formData.caixas) || 0,
      peso: Number(formData.peso) || 0
    })
    setModoEdicao(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tecla Enter para navegar entre campos
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputs = Array.from(document.querySelectorAll('input'))
      const currentIndex = inputs.indexOf(e.target as HTMLInputElement)
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus()
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2 z-50">
      <Card className="w-full max-w-sm max-h-[90vh] overflow-hidden">
        <CardContent className="p-2">
          {/* Cabeçalho fixo */}
          <div className="sticky top-0 bg-white z-10 pb-1 border-b">
            <div className="flex justify-between items-center mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold truncate">Validação #{validacao.id}</h3>
                <p className="text-sm text-gray-600 truncate">Endereço: {validacao.endereco}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCancelar}
                className="h-8 w-8 p-0 shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Conteúdo rolável */}
          <div className="space-y-1 mt-3 overflow-y-auto max-h-[calc(90vh-140px)] pr-1">
            <div>
              <Label htmlFor="sku" className="text-sm font-semibold mb-1 block">
                SKU *
              </Label>
              <Input
                id="sku"
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                onKeyDown={handleKeyDown}
                className="h-10 text-base"
                placeholder="Digite o SKU"
                required
              />
            </div>

            <div>
              <Label htmlFor="lote" className="text-sm font-semibold mb-1 block">
                Lote
              </Label>
              <Input
                id="lote"
                type="text"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                onKeyDown={handleKeyDown}
                className="h-10 text-base"
                placeholder="Digite o lote"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="caixas" className="text-sm font-semibold mb-1 block">
                  Caixas
                </Label>
                <Input
                  id="caixas"
                  type="number"
                  min="0"
                  value={formData.caixas}
                  onChange={(e) => setFormData({ ...formData, caixas: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="h-10 text-base"
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>

              <div>
                <Label htmlFor="peso" className="text-sm font-semibold mb-1 block">
                  Peso (kg)
                </Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="h-10 text-base"
                  placeholder="0.00"
                  inputMode="decimal"
                />
              </div>
            </div>

            {/* Rodapé fixo */}
            <div className="sticky bottom-0 bg-white pt-4 pb-1">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onCancelar} 
                  className="flex-1 h-10 text-sm font-medium"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSalvar} 
                  className="flex-1 h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700"
                  disabled={!formData.sku.trim()} // Desabilita se SKU estiver vazio
                >
                  Salvar
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                * Campos obrigatórios
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}