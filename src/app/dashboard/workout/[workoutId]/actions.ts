"use server"

import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { updateWorkout } from "@/data/workouts"

const updateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1),
  startedAt: z.date(),
})

type UpdateWorkoutArgs = z.infer<typeof updateWorkoutSchema>

export async function updateWorkoutAction(args: UpdateWorkoutArgs) {
  const { userId } = await auth()
  if (!userId) {
    return { success: false as const, error: "Not authenticated" }
  }

  const parsed = updateWorkoutSchema.safeParse(args)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten() }
  }

  const workout = await updateWorkout({
    userId,
    workoutId: parsed.data.workoutId,
    name: parsed.data.name,
    startedAt: parsed.data.startedAt,
  })

  if (!workout) {
    return { success: false as const, error: "Workout not found" }
  }

  revalidatePath("/dashboard")

  return { success: true as const, workout }
}
