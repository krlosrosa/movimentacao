import { axiosFetcher } from "@/_service/http/axios.http";
import { useQuery } from "@tanstack/react-query";

export default function useBuscarDemanda(centerId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['demanda'],
    queryFn: () => buscarDemanda(centerId),
    refetchInterval: 1000 * 20 , // 5 minutos
  });
  return { data, isLoading, error };
}

function buscarDemanda(centerId: string) {
  return axiosFetcher({
    url: `/api/movimentacao/next/${centerId}`,
    method: 'GET',
  });
}