import { useEffect, useRef } from "react"
import { Input } from "@/_shared/_components/ui/input"
import { Search } from "lucide-react"

interface BuscaCodigoBarrasProps {
  onBuscar: (codigo: string) => void
  disabled?: boolean
  placeholder?: string
}

export function BuscaCodigoBarras({ onBuscar, disabled, placeholder }: BuscaCodigoBarrasProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault()
      const codigo = inputRef.current?.value.trim()
      if (codigo) {
        onBuscar(codigo)
        inputRef.current!.value = ""
      }
    }
  }

  // Foco automático no input
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder || "Digite o código de barras e pressione Enter/Tab..."}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pl-10 pr-4 py-3 text-base"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  )
}