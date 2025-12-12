'use client'
import useBuscarEndereco from "@/_modules/movimentacao/hooks/buscar-endereco"
import { ValidacaoContagemLite } from "@/_modules/movimentacao/types/validacao-contatem-lite"
import ValidacaoEstoque from "@/_modules/movimentacao/views/validacaoEstoque"
import { useSearchParams } from "next/navigation"

export default function Validacao() {
  const searchParams = useSearchParams()
  const endereco = searchParams.get('endereco')
  const { data: enderecoData, isLoading: isLoadingEndereco, error: errorEndereco } = useBuscarEndereco(endereco as string)
  return (
    <div>
      {enderecoData && <ValidacaoEstoque validacao={enderecoData as ValidacaoContagemLite[]} />}
    </div>
  )
} 