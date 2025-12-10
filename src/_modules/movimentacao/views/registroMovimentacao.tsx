'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/_components/ui/tabs";
import EnderecoOrigem from "../components/enderecoOrigem";
import { useState } from "react";
import SSCC from "../components/sscc";
import EnderecoDestino from "../components/enderecoDestino";
import { useUser } from "@/_shared/_providers/UserContext";
import { Button } from "@/_shared/_components/ui/button";
import { signOut } from "next-auth/react";
import DemandaOperador from "../components/demanda";
import Validacao from "../components/validacao";
import useGetDemanda from "../hooks/useGetDemanda";
import { Demanda } from "../store/demanda";


export default function RegistroMovimentacao() {
  const { user } = useUser();
  const [tabSelect, setTabSelect] = useState<string>("demanda");
  const { data: demanda, isLoading, error } = useGetDemanda();
  if (isLoading) {
    return <div>Carregando...</div>
  }
  if (error) {
    return <div>Erro ao carregar demanda: {error.message}</div>
  }
  if (!demanda) {
    return <div>Nenhuma demanda encontrada</div>
  }

  
  return (
    <div>
      <Tabs value={tabSelect} onValueChange={setTabSelect}>
        <TabsList hidden={true} >
          <TabsTrigger value="demanda">Demanda</TabsTrigger>
          <TabsTrigger value="enderecoOrigem">Endereço de Origem</TabsTrigger>
          <TabsTrigger value="sscc">SSCC</TabsTrigger>
          <TabsTrigger value="enderecoDestino">Endereço de Destino</TabsTrigger>
          <TabsTrigger value="validacao">Validacao</TabsTrigger>
        </TabsList>
        <TabsContent value="demanda"> 
          <DemandaOperador setTabSelect={setTabSelect} demanda={demanda as Demanda} />
        </TabsContent>
        <TabsContent value="enderecoOrigem">
          <EnderecoOrigem demanda={demanda as Demanda} setTabSelect={setTabSelect} />
        </TabsContent>
        <TabsContent value="enderecoDestino">
          <EnderecoDestino demanda={demanda as Demanda} setTabSelect={setTabSelect} />
        </TabsContent>
        <TabsContent value="sscc">
          <SSCC demanda={demanda as Demanda} setTabSelect={setTabSelect} />
        </TabsContent>
        <TabsContent value="validacao">
          <Validacao demanda={demanda as Demanda} setTabSelect={setTabSelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
}