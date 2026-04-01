"use client"

import { useState } from "react"
import type { Agendamento, AgendamentoStatus } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Phone,
  Eye,
} from "lucide-react"
import { TriagemSheet } from "@/components/triagem-sheet"

interface AgendamentosTableProps {
  agendamentos: Agendamento[] | undefined
  loading: boolean
  onStatusChange: () => void
}

const statusConfig: Record<
  AgendamentoStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  pendente: {
    label: "Pendente",
    className: "bg-warning/10 text-warning-foreground",
    icon: Clock,
  },
  confirmado: {
    label: "Confirmado",
    className: "bg-primary/10 text-primary",
    icon: FileCheck,
  },
  finalizado: {
    label: "Finalizado",
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
  falta: {
    label: "Falta",
    className: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
}

function formatTime(horario: string) {
  return horario.slice(0, 5)
}

function formatPhone(phone: string) {
  const clean = phone.replace(/\D/g, "")
  return `https://wa.me/${clean}`
}

function formatPhoneDisplay(phone: string) {
  const clean = phone.replace(/\D/g, "")
  if (clean.length === 13) {
    return `(${clean.slice(2, 4)}) ${clean.slice(4, 9)}-${clean.slice(9)}`
  }
  return phone
}

export function AgendamentosTable({
  agendamentos,
  loading,
  onStatusChange,
}: AgendamentosTableProps) {
  const [triageOpen, setTriageOpen] = useState(false)
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<Agendamento | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function updateStatus(id: string, status: AgendamentoStatus) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/agendamentos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        onStatusChange()
      }
    } finally {
      setUpdatingId(null)
    }
  }

  function openTriagem(agendamento: Agendamento) {
    setSelectedAgendamento(agendamento)
    setTriageOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const items: Agendamento[] = Array.isArray(agendamentos) ? agendamentos : []

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">
            Agendamentos ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-4 pb-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Nenhum agendamento nesta data
              </p>
            </div>
          ) : (
            items.map((ag) => {
              const config = statusConfig[ag.status]
              const StatusIcon = config.icon
              const isUpdating = updatingId === ag.id

              return (
                <div
                  key={ag.id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Info */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-foreground">
                      {formatTime(ag.horario)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {ag.nome_beneficiario}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CPF: {ag.cpf}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                        <a
                          href={formatPhone(ag.telefone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          aria-label={`WhatsApp de ${ag.nome_beneficiario}`}
                        >
                          <Phone className="h-3 w-3" />
                          {formatPhoneDisplay(ag.telefone)}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {ag.status === "pendente" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openTriagem(ag)}
                          disabled={isUpdating}
                          className="text-xs"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          Triagem
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(ag.id, "falta")}
                          disabled={isUpdating}
                          className="text-xs"
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Falta
                        </Button>
                      </>
                    )}
                    {ag.status === "confirmado" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(ag.id, "finalizado")}
                          disabled={isUpdating}
                          className="text-xs bg-success text-success-foreground hover:bg-success/90"
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Finalizar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(ag.id, "falta")}
                          disabled={isUpdating}
                          className="text-xs"
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Falta
                        </Button>
                      </>
                    )}
                    {(ag.status === "finalizado" || ag.status === "falta") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateStatus(ag.id, "pendente")}
                        disabled={isUpdating}
                        className="text-xs text-muted-foreground"
                      >
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        Reabrir
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <TriagemSheet
        agendamento={selectedAgendamento}
        open={triageOpen}
        onOpenChange={setTriageOpen}
        onConfirm={() => {
          if (selectedAgendamento) {
            updateStatus(selectedAgendamento.id, "confirmado")
            setTriageOpen(false)
          }
        }}
        onReject={() => {
          if (selectedAgendamento) {
            updateStatus(selectedAgendamento.id, "falta")
            setTriageOpen(false)
          }
        }}
      />
    </>
  )
}
