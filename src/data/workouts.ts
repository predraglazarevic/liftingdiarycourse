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
