import { axiosFetcher } from "@/_service/http/axios.http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export type AddAnomaliaContagemLiteBody = {
  sku?: string
  lote?: string
  caixas?: number
  peso?: number
}


type AddAnomaliaContagemLiteProps = {
  endereco: string
  centerId: string
  body: AddAnomaliaContagemLiteBody
}


export default function useAddAnomaliaContagemLite() {
  const queryClient = useQueryClient();

  const { mutate: addAnomaliaContagemLite, isPending, error } = useMutation({
    mutationFn: ({ centerId, endereco, body }: AddAnomaliaContagemLiteProps) => addAnomaliaContagemLiteMutation(centerId, endereco, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contagemLite'] })
      toast.success('Anomalia adicionada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao adicionar anomalia')
    },
  });
  return { addAnomaliaContagemLite, isPending, error };
}

function addAnomaliaContagemLiteMutation(centerId: string, endereco: string, body: AddAnomaliaContagemLiteBody) {
  return axiosFetcher({
    url: `/api/movimentacao/add-anomalia-contagem-lite/${centerId}/${endereco}`,
    method: 'POST',
    data: body,
  });
}