import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, CheckCircle2, Users } from "lucide-react"

interface MetricsData {
  atendimentos_mes: number
  proxima_terca: string
  total_agendados: number
  vagas_restantes: number
  vagas_pendentes: number
}

interface MetricsCardsProps {
  metrics: MetricsData | undefined
  loading: boolean
}

function formatDateBR(dateStr: string) {
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}

export function MetricsCards({ metrics, loading }: MetricsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: "Atendimentos no mes",
      value: metrics?.atendimentos_mes ?? 0,
      icon: CheckCircle2,
      iconColor: "text-success",
      iconBg: "bg-success/10",
    },
    {
      label: "Vagas restantes",
      value: metrics?.vagas_restantes ?? 0,
      icon: Users,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Proxima terca",
      value: metrics?.proxima_terca ? formatDateBR(metrics.proxima_terca) : "--",
      icon: CalendarDays,
      iconColor: "text-warning",
      iconBg: "bg-warning/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-xl font-semibold text-foreground">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
