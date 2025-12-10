import { axiosFetcher } from "@/_service/http/axios.http";
import { useQuery } from "@tanstack/react-query";

export default function useBuscarDemanda(centerId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['demanda'],
    queryFn: () => buscarDemanda(centerId),
  });
  return { data, isLoading, error };
}

function buscarDemanda(centerId: string) {
  return axiosFetcher({
    url: `/api/movimentacao/next/${centerId}`,
    method: 'GET',
  });
}