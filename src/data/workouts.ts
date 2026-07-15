import { eq, and } from "drizzle-orm"

import { db } from "@/db"
import { workouts } from "@/db/schema"

export async function createWorkout(args: {
  userId: string
  name: string
  startedAt: Date
}) {
  const [workout] = await db
    .insert(workouts)
    .values({
      user_id: args.userId,
      name: args.name,
      started_at: args.startedAt,
    })
    .returning()

  return workout
}

export async function updateWorkout(args: {
  userId: string
  workoutId: string
  name: string
  startedAt: Date
}) {
  const [workout] = await db
    .update(workouts)
    .set({
      name: args.name,
      started_at: args.startedAt,
      updated_at: new Date(),
    })
    .where(
      and(eq(workouts.id, args.workoutId), eq(workouts.user_id, args.userId))
    )
    .returning()

  return workout
}
