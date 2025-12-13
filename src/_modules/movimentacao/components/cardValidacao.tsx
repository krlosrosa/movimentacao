'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/_shared/_components/ui/card"
import { Badge } from "@/_shared/_components/ui/badge"
import { Button } from "@/_shared/_components/ui/button"
import { CheckCircle2, Edit2 } from "lucide-react"
import { ValidacaoContagemLite } from "../types/validacao-contatem-lite"

// Card de Validação Individual
export default function CardValidacao({ 
  validacao, 
  onConfirmar, 
  onEditar 
}: { 
  validacao: ValidacaoContagemLite
  onConfirmar: () => void
  onEditar: () => void
}) {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onConfirmar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [validacao])

  return (
    <Card className="w-full border-2">
      <CardContent className="p-3 space-y-2.5">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
           <p className="font-mono text-lg text-gray-600 font-bold ">{validacao.sku}</p>
          </div>
          <Badge 
            variant={validacao.validado ? "default" : "outline"}
            className={`text-xs px-2 py-0.5 ${
              validacao.validado 
                ? "bg-green-500 text-white" 
                : "border-orange-400 text-orange-700 bg-orange-50"
            }`}
          >
            {validacao.validado ? "✓" : "!"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-2 rounded border border-blue-200">
            <p className="text-[10px] font-medium text-blue-600 uppercase">Endereço</p>
            <p className="text-sm font-bold text-blue-900">{validacao.endereco}</p>
          </div>
          <div className="bg-purple-50 p-2 rounded border border-purple-200">
            <p className="text-[10px] font-medium text-purple-600 uppercase">Data</p>
            <p className="text-sm font-bold text-purple-900">{validacao.dataRef}</p>
          </div>
        </div>
        
        {validacao.descricao && (
          <div className="bg-gray-50 p-2 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-900 truncate">{validacao.descricao}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          {validacao.caixas !== undefined && (
            <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
              <p className="text-[10px] font-medium text-emerald-600 uppercase">Caixas</p>
              <p className="text-xl font-bold text-emerald-900">{validacao.caixas}</p>
            </div>
          )}
          {validacao.qtdPalete !== undefined && (
            <div className="bg-amber-50 p-2 rounded border border-amber-200">
              <p className="text-[10px] font-medium text-amber-600 uppercase">Peso</p>
              <p className="text-xl font-bold text-amber-900">{validacao.peso}</p>
            </div>
          )}
        </div>
        
        {(validacao.lote || validacao.dataValidade) && (
          <div className="flex gap-3 text-[11px]">
            {validacao.lote && (
              <span className="text-gray-600">
                Lote: <span className="font-bold text-gray-900">{validacao.lote}</span>
              </span>
            )}
            {validacao.dataValidade && (
              <span className="text-gray-600">
                Val: <span className="font-bold text-gray-900">{validacao.dataValidade}</span>
              </span>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
            onClick={onEditar}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            Editar
          </Button>
          <Button 
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={onConfirmar}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Confirmar
          </Button>
        </div>
        
        <div className="pt-2 border-t border-gray-200 text-[10px] text-gray-500 flex justify-between">
          <span>Centro: <span className="font-bold text-gray-700">{validacao.centroId}</span></span>
          <div className="flex gap-2">
            {validacao.adicionarPor && <span>A: {validacao.adicionarPor}</span>}
            {validacao.contadoPor && <span>C: {validacao.contadoPor}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}