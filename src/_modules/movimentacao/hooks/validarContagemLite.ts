import { axiosFetcher } from "@/_service/http/axios.http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ValidarContagemLiteProps = {
  endereco: string
  centerId: string
}

export default function useValidarContagemLite() {
  const queryClient = useQueryClient();

  const { mutate: validarContagemLite, isPending, error } = useMutation({
    mutationFn: ({ endereco, centerId }: ValidarContagemLiteProps) => validarContagemLiteMutation(endereco, centerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contagemLite'] })
    },
  });
  return { validarContagemLite, isPending, error };
}

function validarContagemLiteMutation(endereco: string, centerId: string) {
  return axiosFetcher({
    url: `/api/movimentacao/validar-endereco/${endereco}/${centerId}`,
    method: 'PUT',
  });
}