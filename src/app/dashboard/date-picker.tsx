"use client"

import { useRouter } from "next/navigation"

import { Calendar } from "@/components/ui/calendar"

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function DashboardDatePicker({ selected }: { selected: Date }) {
  const router = useRouter()

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(date) => {
        if (!date) return
        router.push(`/dashboard?date=${toDateKey(date)}`)
      }}
    />
  )
}
