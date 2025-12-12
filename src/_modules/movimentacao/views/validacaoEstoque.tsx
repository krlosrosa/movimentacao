import ModalEdicao, { FormData } from "./modalEditar"
import { useState } from "react"
import { ValidacaoContagemLite } from "../types/validacao-contatem-lite"
import { Button } from "@/_shared/_components/ui/button"
import { ChevronLeft, ChevronRight, Barcode, CheckCircle, Edit, X } from "lucide-react"
import CardValidacao from "../components/cardValidacao"
import { useRouter } from "next/navigation"
import useValidarContagem from "../hooks/useValidarContagem"

export default function ValidacaoEstoque({ validacao }: { validacao: ValidacaoContagemLite[] }) {
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [validacoes, setValidacoes] = useState(validacao)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [mostrarModalConclusao, setMostrarModalConclusao] = useState(false)
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
    
    console.log('Confirmado:', novasValidacoes[indiceAtual])
    
    // Verifica se após confirmar este, todos estão validados
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
    // Aqui você implementaria a lógica para bipar um novo endereço
    router.push(`/contagem`)
  }

  // Componente para mostrar quando todas as validações estão completas
  const TodasConcluidas = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        {/* Header com botão fechar */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="mr-3">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Todas as validações concluídas! ✅
              </h3>
              <p className="text-gray-600">
                {totalValidacoes} itens validados com sucesso
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-center">
              Você concluiu a validação de todos os itens deste endereço.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleBiparNovoEndereco}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
            >
              <Barcode className="w-5 h-5 mr-2" />
              Bipar novo endereço
            </Button>
            
            <Button
              onClick={() => {
                // Fecha o modal e permite editar
                setMostrarModalConclusao(false)
                // Pode navegar para o primeiro item não validado ou deixar onde está
                // Aqui você pode adicionar lógica para ir para um item específico
              }}
              variant="outline"
              className="w-full h-12"
            >
              <Edit className="w-5 h-5 mr-2" />
              Continuar Editando
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header com progresso */}
        <div className="max-w-2xl mx-auto mb-4 bg-white p-2 rounded-lg border-2 border-gray-200">
          <div className="flex justify-between items-center mb-1">
          </div>
          <div className="flex gap-1 items-center">
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
      
      {/* Modal de conclusão - APENAS QUANDO TODOS ESTIVEREM VALIDADOS */}
      {mostrarModalConclusao && <TodasConcluidas />}
    </>
  )
}