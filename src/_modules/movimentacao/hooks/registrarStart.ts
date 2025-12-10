import { axiosFetcher } from "@/_service/http/axios.http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useRegistrarStart() {
  const queryClient = useQueryClient();
  const { mutate: registrarStart, isPending, error } = useMutation({
    mutationFn: (idMov: number) => registrarStartMutation(idMov),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacao'] })
    },
  });
  return { registrarStart, isPending, error };
}

function registrarStartMutation(idMov: number) {
  return axiosFetcher({
    url: `/api/movimentacao/${idMov}/start`,
    method: 'PUT',
  });
}