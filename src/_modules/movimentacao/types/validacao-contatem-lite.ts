export type ValidacaoContagemLite = {
  id: number
  dataRef: string
  endereco: string
  sku: string
  descricao?: string
  dataValidade?: string
  lote?: string
  peso?: string
  caixas?: number
  qtdPalete?: number
  capacidadePalete?: number
  area?: string
  centroId: string
  codigoBloqueio?: string
  validado?: boolean
  adicionarPor?: string
  contadoPor?: string
}