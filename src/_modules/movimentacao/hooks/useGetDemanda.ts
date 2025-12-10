import { useUser } from "@/_shared/_providers/UserContext";
import useBuscarDemanda from "./buscarDemanda";

export default function useGetDemanda() {
  const { user } = useUser();
  if (!user) {
    throw new Error('User not found');
  }
  const { data, isLoading, error } = useBuscarDemanda(user.centerSelect as string);
  return { data, isLoading, error };
}