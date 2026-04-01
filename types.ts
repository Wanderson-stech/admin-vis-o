export type AgendamentoStatus = "pendente" | "confirmado" | "finalizado" | "falta"

export interface Agendamento {
  id: string
  nome_beneficiario: string
  cpf: string
  telefone: string
  data: string
  horario: string
  documento_cras_url: string | null
  status: AgendamentoStatus
  created_at: string
  updated_at: string
}
