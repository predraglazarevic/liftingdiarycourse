"use server"

import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { createWorkout } from "@/data/workouts"

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  startedAt: z.date(),
})

type CreateWorkoutArgs = z.infer<typeof createWorkoutSchema>

export async function createWorkoutAction(args: CreateWorkoutArgs) {
  const { userId } = await auth()
  if (!userId) {
    return { success: false as const, error: "Not authenticated" }
  }

  const parsed = createWorkoutSchema.safeParse(args)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten() }
  }

  const workout = await createWorkout({
    userId,
    name: parsed.data.name,
    startedAt: parsed.data.startedAt,
  })

  revalidatePath("/dashboard")

  return { success: true as const, workout }
}
