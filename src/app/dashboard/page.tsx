import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { format } from "date-fns"

import { getWorkoutsForDate } from "@/data/queries"
import { DashboardDatePicker } from "./date-picker"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function parseDateKey(dateKey: string | undefined) {
  if (dateKey && /^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    const [year, month, day] = dateKey.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    if (!Number.isNaN(date.getTime())) return date
  }
  return new Date()
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { date } = await searchParams
  const selectedDate = parseDateKey(date)
  const workouts = await getWorkoutsForDate(userId, selectedDate)

  return (
    <div className="mx-auto flex w-[70%] flex-1 flex-col gap-6 p-6 sm:p-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="w-fit">
          <CardContent>
            <DashboardDatePicker selected={selectedDate} />
          </CardContent>
        </Card>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <CardTitle>{workout.name ?? "Workout"}</CardTitle>
                  {workout.started_at && (
                    <CardDescription>
                      {format(workout.started_at, "do MMM yyyy")}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  {workout.workout_exercises.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No exercises logged.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {workout.workout_exercises.map((we) => (
                        <li key={we.id} className="flex flex-col gap-1">
                          <span className="text-sm font-medium">{we.exercise?.name}</span>
                          <ul className="flex flex-wrap gap-2">
                            {we.sets.map((set) => (
                              <li key={set.id}>
                                <Badge variant="secondary">
                                  {set.weight ?? "-"} x {set.reps ?? "-"}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
