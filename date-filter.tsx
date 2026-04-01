"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DateFilterProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T12:00:00")
  date.setDate(date.getDate() + days)
  return date.toISOString().split("T")[0]
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  const weekdays = [
    "Domingo", "Segunda", "Terca", "Quarta",
    "Quinta", "Sexta", "Sabado",
  ]
  const months = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ]
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  return `${weekday}, ${day} de ${month}`
}

export function DateFilter({ selectedDate, onDateChange }: DateFilterProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDateChange(addDays(selectedDate, -7))}
        aria-label="Semana anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {formatDateLabel(selectedDate)}
        </p>
        <p className="text-xs text-muted-foreground">{selectedDate}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDateChange(addDays(selectedDate, 7))}
        aria-label="Proxima semana"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
