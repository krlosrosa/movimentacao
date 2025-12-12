'use client'
import { Input } from "@/_shared/_components/ui/input"
import useValidarContagem from "../hooks/useValidarContagem"
import { Button } from "@/_shared/_components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Loader2, Barcode, ArrowRight, Search } from "lucide-react"

export default function ContagemEstoque() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [enderecoInput, setEnderecoInput] = useState("")
  const [validado, setValidado] = useState(false)
  
  const { 
    endereco, 
    setEndereco, 
    enderecoData, 
    isLoadingEndereco, 
    errorEndereco 
  } = useValidarContagem()

  // Foco automático no input ao carregar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Função para validar e buscar endereço
  const handleBuscarEndereco = () => {
    if (enderecoInput.length >= 10) {
      setEndereco(enderecoInput)
      setValidado(true)
    }
  }

  // Função para resetar busca
  const handleReset = () => {
    setEnderecoInput("")
    setEndereco("")
    setValidado(false)
    inputRef.current?.focus()
  }

  // Função para iniciar validação
  const iniciarValidacao = () => {
    if (enderecoData) {
      router.push(`/contagem/validacao?endereco=${endereco}`)
    }
  }

  // Função para tratar submit (pode ser via Enter)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (enderecoInput.length >= 10 && !validado) {
      handleBuscarEndereco()
    } else if (enderecoData && validado) {
      iniciarValidacao()
    }
  }

  // Verifica se input é válido para buscar
  const inputValido = enderecoInput.length >= 10
  const podeBuscar = inputValido && !validado && !isLoadingEndereco
  const podeIniciar = enderecoData && validado && !isLoadingEndereco

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Formulário de leitura */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Campo de input */}
            <div className="mb-4">
              <label 
                htmlFor="endereco-input" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Código do Endereço
                <span className="text-destructive ml-1">*</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({enderecoInput.length}/10 caracteres)
                </span>
              </label>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    id="endereco-input"
                    type="text"
                    value={enderecoInput}
                    onChange={(e) => setEnderecoInput(e.target.value)}
                    placeholder="Digite ou bipe o código (mín. 10 caracteres)"
                    className="pl-12 text-lg h-14"
                    disabled={isLoadingEndereco || validado}
                    maxLength={50}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Barcode className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                {!validado && (
                  <Button
                    type="button"
                    onClick={handleBuscarEndereco}
                    disabled={!podeBuscar}
                    className="h-14 px-6"
                    variant={inputValido ? "default" : "outline"}
                  >
                    {isLoadingEndereco ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>
              
              {/* Contador de caracteres */}
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span className={
                    enderecoInput.length < 10 
                      ? "text-destructive" 
                      : "text-green-600"
                  }>
                    {enderecoInput.length >= 10 
                      ? "✓ Comprimento válido" 
                      : `Mínimo 10 caracteres (faltam ${10 - enderecoInput.length})`
                    }
                  </span>
                  <span className="text-gray-500">
                    {enderecoInput.length}/10
                  </span>
                </div>
                {/* Barra de progresso */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      enderecoInput.length >= 10 
                        ? "bg-green-500" 
                        : "bg-primary"
                    }`}
                    style={{ width: `${Math.min((enderecoInput.length / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Feedback de validação */}
            {isLoadingEndereco && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  <span className="text-blue-700 font-medium">
                    Buscando informações do endereço...
                  </span>
                </div>
              </div>
            )}

            {errorEndereco && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <span>❌</span>
                  <span className="font-medium">{errorEndereco.message}</span>
                </div>
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* Informações do endereço encontrado */}
            {enderecoData && validado && (
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-green-800 mb-1 flex items-center gap-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        Endereço validado com sucesso!
                      </h3>
                      <p className="text-green-700">
                        <span className="font-medium">Código:</span> {endereco}
                      </p>
                      {enderecoData[0].descricao && (
                        <p className="text-green-700 mt-1">
                          <span className="font-medium">Descrição:</span> {enderecoData[0].descricao}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={handleReset}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-800"
                    >
                      Alterar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de ação principal */}
            <div className="space-y-3">
              <Button
                type="submit"
                onClick={iniciarValidacao}
                disabled={!podeIniciar}
                className="w-full h-14 text-lg font-semibold gap-3"
                size="lg"
              >
                {isLoadingEndereco ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Iniciar Contagem
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              {validado && (
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  Digitar outro endereço
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Instruções */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Passo a passo:
          </h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="shrink-0w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium text-gray-800">Bipe ou digite o código</p>
                <p className="text-sm text-gray-600">Mínimo de 10 caracteres</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="shrink-0w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium text-gray-800">Clique em "Buscar"</p>
                <p className="text-sm text-gray-600">Validaremos o endereço</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="shrink-0w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-gray-800">Confirme e inicie</p>
                <p className="text-sm text-gray-600">Clique em "Iniciar Contagem"</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Hotkeys info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Digite o código e pressione <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> para buscar</p>
        </div>
      </div>
    </div>
  )
}