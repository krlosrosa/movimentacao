import { useQueryClient } from "@tanstack/react-query";
import useValidateDemandaMutation from "./validateDemanda.mutation";

export default function useValidateDemanda() {
  const { validateDemanda, isPending, error } = useValidateDemandaMutation();
  return { validateDemanda, isPending, error };
}