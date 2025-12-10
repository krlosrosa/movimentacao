'use client';
import { Button } from "@/_shared/_components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleStartProcess = () => {
    router.push('/demanda');
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        <Button onClick={handleStartProcess}>
          Iniciar Processo de Movimentação
        </Button>
      </div>
    </div>
  );
}
