import { create } from "zustand";

export type Demanda = {
  idMov: number;
  idUsuario: string;
  idCentro: string;
  palete: string;
  origem: string;
  destino: string;
  prioridade: number;
  status: string;
  dataCriacao: string | null;
  dataExecucao: string | null;
  sku: string;
  descricao: string;
  lote: string;
}

interface DemandaStore {
  demanda: Demanda | null;
  setDemanda: (demanda: Demanda) => void;
}



export const useDemandaStore = create<DemandaStore>((set) => ({
  demanda: null,
  setDemanda: (demanda: Demanda) => set({ demanda }),
}));