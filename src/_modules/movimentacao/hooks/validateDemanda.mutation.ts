import { axiosFetcher } from "@/_service/http/axios.http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useValidateDemandaMutation() {
  const queryClient = useQueryClient();
  const { mutate: validateDemanda, isPending, error } = useMutation({
    mutationFn: (id: string) => validateDemandaMutation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demanda'] })
    },
  });
  return { validateDemanda, isPending, error };
}

function validateDemandaMutation(id: string) {
  return axiosFetcher({
    url: `/api/movimentacao/${id}/validate`,
    method: 'PUT',
  });
}