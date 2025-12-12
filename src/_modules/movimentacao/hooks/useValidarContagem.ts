import { useState } from "react";
import useBuscarEndereco from "./buscar-endereco";
import useValidarContagemLite from "./validarContagemLite";
import { useUser } from "@/_shared/_providers/UserContext";
import useAddAnomaliaContagemLite, { AddAnomaliaContagemLiteBody } from "./addAnomaliaContagemLite";

export default function useValidarContagem() {
  const { user } = useUser()
  const [endereco, setEndereco] = useState("")
  const { data: enderecoData, isLoading: isLoadingEndereco, error: errorEndereco } = useBuscarEndereco(endereco)

  const { validarContagemLite, isPending: isPendingValidarContagemLite, error: errorValidarContagemLite } = useValidarContagemLite()

  const { addAnomaliaContagemLite, isPending: isPendingAddAnomaliaContagemLite, error: errorAddAnomaliaContagemLite } = useAddAnomaliaContagemLite()

  const handleValidarContagemLite = (endereco: string) => {
    validarContagemLite({ endereco, centerId: user?.centerSelect as string })
  }

  const handleAddAnomaliaContagemLite = (endereco: string, body: AddAnomaliaContagemLiteBody) => {
    addAnomaliaContagemLite({ centerId: user?.centerSelect as string, endereco, body })
  }


  return {
    endereco,
    setEndereco,
    enderecoData,
    isLoadingEndereco,
    errorEndereco,
    handleValidarContagemLite,
    handleAddAnomaliaContagemLite,
  }
}