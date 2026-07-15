import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"

import { getWorkoutById } from "@/data/queries"
import { EditWorkoutForm } from "./edit-workout-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { workoutId } = await params
  const workout = await getWorkoutById(userId, workoutId)
  if (!workout) notFound()

  return (
    <div className="mx-auto flex w-[70%] max-w-lg flex-1 flex-col gap-6 p-6 sm:p-10">
      <h1 className="text-2xl font-semibold">Edit workout</h1>

      <Card>
        <CardHeader>
          <CardTitle>Workout details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm
            workoutId={workout.id}
            initialName={workout.name ?? ""}
            initialStartedAt={workout.started_at ?? new Date()}
          />
        </CardContent>
      </Card>
    </div>
  )
}
