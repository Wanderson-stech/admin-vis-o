"use client"

import type { Agendamento } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CheckCircle2, XCircle, FileWarning, Phone } from "lucide-react"

interface TriagemSheetProps {
  agendamento: Agendamento | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onReject: () => void
}

function formatPhoneDisplay(phone: string) {
  const clean = phone.replace(/\D/g, "")
  if (clean.length === 13) {
    return `(${clean.slice(2, 4)}) ${clean.slice(4, 9)}-${clean.slice(9)}`
  }
  return phone
}

export function TriagemSheet({
  agendamento,
  open,
  onOpenChange,
  onConfirm,
  onReject,
}: TriagemSheetProps) {
  if (!agendamento) return null

  const hasDocument = !!agendamento.documento_cras_url

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-foreground">Triagem de Documentos</SheetTitle>
          <SheetDescription>
            Verifique o comprovante CRAS da beneficiaria
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          {/* Info da beneficiaria */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground">
              {agendamento.nome_beneficiario}
            </p>
            <p className="text-xs text-muted-foreground">
              CPF: {agendamento.cpf}
            </p>
            <a
              href={`https://wa.me/${agendamento.telefone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Phone className="h-3 w-3" />
              {formatPhoneDisplay(agendamento.telefone)}
            </a>
          </div>

          {/* Documento CRAS */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Comprovante CRAS
            </p>
            {hasDocument ? (
              <div className="overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={agendamento.documento_cras_url!}
                  alt="Comprovante CRAS"
                  className="h-auto w-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <FileWarning className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  Documento nao enviado
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  A beneficiaria ainda nao anexou o comprovante CRAS
                </p>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex flex-row gap-2">
          <Button
            variant="destructive"
            onClick={onReject}
            className="flex-1"
          >
            <XCircle className="mr-1.5 h-4 w-4" />
            Recusar
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-success text-success-foreground hover:bg-success/90"
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            Confirmar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
