import { Button } from "@/_shared/_components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/_components/ui/dialog";
import { useState } from "react";

interface ModalValidarAnomaliaProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onValidarAnomalia: () => void
}

export default function ModalValidarAnomalia({ isOpen, setIsOpen, onValidarAnomalia }: ModalValidarAnomaliaProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full" asChild>
        <Button variant="destructive">
          PALETE NÃO ENCONTRADO
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Validar Anomalia</DialogTitle>
        </DialogHeader>
        <div>
          Validar Anomalia
        </div>
      <DialogFooter>
        <Button onClick={onValidarAnomalia}>Validar Anomalia</Button>
        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}