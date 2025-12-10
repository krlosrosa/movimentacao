import { axiosFetcher } from "@/_service/http/axios.http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useRegistrarAnomalia() {
  const queryClient = useQueryClient();
  const { mutate: registrarAnomalia, isPending, error } = useMutation({
    mutationFn: (idMov: number) => registrarAnomaliaMutation(idMov),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demanda'] })
    },
  });
  return { registrarAnomalia, isPending, error };
}

function registrarAnomaliaMutation(idMov: number) {
  return axiosFetcher({
    url: `/api/movimentacao/${idMov}/anomalia`,
    method: 'PUT',
  });
}