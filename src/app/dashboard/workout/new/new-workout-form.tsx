"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { createWorkoutAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function NewWorkoutForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [startedAt, setStartedAt] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = await createWorkoutAction({ name, startedAt })

    if (!result.success) {
      setError("Could not create workout. Please check the form and try again.")
      setIsSubmitting(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Workout name</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Leg day"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="started-at">Date</Label>
        <Popover>
          <PopoverTrigger
            render={
              <Button id="started-at" type="button" variant="outline">
                {format(startedAt, "do MMM yyyy")}
              </Button>
            }
          />
          <PopoverContent>
            <Calendar
              mode="single"
              selected={startedAt}
              onSelect={(date) => date && setStartedAt(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create workout"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
