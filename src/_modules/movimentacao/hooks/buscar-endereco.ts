import { axiosFetcher } from "@/_service/http/axios.http";
import { useQuery } from "@tanstack/react-query";
import { ValidacaoContagemLite } from "../types/validacao-contatem-lite";

export default function useBuscarEndereco(endereco: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contagemLite', endereco],
    queryFn: () => buscarEndereco(endereco),
    enabled: !!endereco && endereco.length >= 10,
    refetchInterval: 1000 * 20 , // 5 minutos
  });
  return { data, isLoading, error };
}

function buscarEndereco(endereco: string) {
  return axiosFetcher<ValidacaoContagemLite[]>({
    url: `/api/movimentacao/get-endereco/${endereco.slice(0, 10)}`,
    method: 'GET',
  });
}