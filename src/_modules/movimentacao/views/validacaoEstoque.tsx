import ModalEdicao, { FormData } from "./modalEditar"
import { useEffect, useState } from "react"
import { ValidacaoContagemLite } from "../types/validacao-contatem-lite"
import { Button } from "@/_shared/_components/ui/button"
import { ChevronLeft, ChevronRight, Barcode, CheckCircle, Edit, X, Search } from "lucide-react"
import CardValidacao from "../components/cardValidacao"
import { useRouter } from "next/navigation"
import useValidarContagem from "../hooks/useValidarContagem"
import { BuscaCodigoBarras } from "./buscaCodeBar"

export default function ValidacaoEstoque({ validacao }: { validacao: ValidacaoContagemLite[] }) {
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [validacoes, setValidacoes] = useState(validacao)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [mostrarModalConclusao, setMostrarModalConclusao] = useState(false)
  const [buscaAtiva, setBuscaAtiva] = useState(false)
  const [statusBusca, setStatusBusca] = useState<'idle' | 'buscando' | 'encontrado' | 'nao-encontrado'>('idle')
  const { handleValidarContagemLite } = useValidarContagem()
  const router = useRouter()

  const validacaoAtual = validacoes[indiceAtual]
  const totalValidacoes = validacoes.length
  const validacoesCompletas = validacoes.filter(v => v.validado).length
  const todasValidadas = validacoesCompletas === totalValidacoes && totalValidacoes > 0

  const handleProximo = () => {
    if (indiceAtual < totalValidacoes - 1) {
      setIndiceAtual(indiceAtual + 1)
    }
  }

  const handleAnterior = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(indiceAtual - 1)
    }
  }

  const handleConfirmar = () => {
    handleValidarContagemLite(validacaoAtual.endereco)
    const novasValidacoes = [...validacoes]
    novasValidacoes[indiceAtual] = { ...novasValidacoes[indiceAtual], validado: true }
    setValidacoes(novasValidacoes)
    
    const todasAgora = novasValidacoes.filter(v => v.validado).length === totalValidacoes
    if (todasAgora) {
      setMostrarModalConclusao(true)
    } else if (indiceAtual < totalValidacoes - 1) {
      setTimeout(() => handleProximo(), 300)
    }
  }

  const handleEditar = () => {
    setModoEdicao(true)
  }

  const handleBiparNovoEndereco = () => {
    router.push('/contagem')
  }

  // Componente para mostrar quando todas as validações estão completas
  const TodasConcluidas = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        {/* Header com botão fechar */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="mr-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Validações Concluídas
              </h3>
              <p className="text-gray-600">
                {totalValidacoes} itens validados
              </p>
            </div>
          </div>
          <button
            onClick={() => setMostrarModalConclusao(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {statusBusca === 'encontrado' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-center">
                Item encontrado! Redirecionando...
              </p>
            </div>
          )}
          
          {statusBusca === 'nao-encontrado' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-center">
                Item não encontrado. Tente outro código.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
              <>
                <Button
                  onClick={handleBiparNovoEndereco}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                >
                  <Barcode className="w-5 h-5 mr-2" />
                  Buscar novo item
                </Button>
                
                <Button
                  onClick={() => setMostrarModalConclusao(false)}
                  variant="outline"
                  className="w-full h-12"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Continuar Editando
                </Button>
              </>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-1">
        {/* Header com progresso */}
        <div className="max-w-2xl mx-auto mb-1 bg-white p-2 rounded-lg border-2 border-gray-200">
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${todasValidadas ? 'bg-green-500' : 'bg-blue-600'}`}
                style={{ width: `${((indiceAtual + 1) / totalValidacoes) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${todasValidadas ? 'text-green-600' : 'text-gray-700'}`}>
              {validacoesCompletas}/{totalValidacoes}
            </span>
          </div>
        </div>

        {/* Card atual */}
        <div className="max-w-2xl mx-auto">
          <CardValidacao 
            validacao={validacaoAtual}
            onConfirmar={handleConfirmar}
            onEditar={handleEditar}
          />
        </div>

        {/* Navegação */}
        <div className="max-w-2xl mx-auto mt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={handleAnterior}
            disabled={indiceAtual === 0}
            className="flex-1"
            size="lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={handleProximo}
            disabled={indiceAtual === totalValidacoes - 1}
            className="flex-1"
            size="lg"
          >
            Próximo
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Modal de edição */}
        {modoEdicao && (
          <ModalEdicao
            setModoEdicao={setModoEdicao}
            validacao={validacaoAtual}
            onCancelar={() => setModoEdicao(false)}
          />
        )}
      </div>
      
      {/* Modal de conclusão */}
      {mostrarModalConclusao && <TodasConcluidas />}
    </>
  )
}