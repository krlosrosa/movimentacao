import useRegistrarAnomalia from "./registrarAnomalia";
import useValidateDemandaMutation from "./validateDemanda.mutation";

export default function useRegisterAnomalia() {
  const { registrarAnomalia, isPending, error } = useRegistrarAnomalia()

  const handleRegisterAnomalia = (idMov: number) => {
    registrarAnomalia(idMov)
  }
  return { handleRegisterAnomalia, isPending, error }
}