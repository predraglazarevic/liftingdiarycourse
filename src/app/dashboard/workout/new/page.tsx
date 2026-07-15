import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { NewWorkoutForm } from "./new-workout-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function NewWorkoutPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <div className="mx-auto flex w-[70%] max-w-lg flex-1 flex-col gap-6 p-6 sm:p-10">
      <h1 className="text-2xl font-semibold">New workout</h1>

      <Card>
        <CardHeader>
          <CardTitle>Workout details</CardTitle>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm />
        </CardContent>
      </Card>
    </div>
  )
}
