import { db } from './index';

export async function getWorkoutsForDate(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    return db.query.workouts.findMany({
        where: {
            user_id: userId,
            started_at: {
                gte: startOfDay,
                lt: startOfNextDay,
            },
        },
        orderBy: {
            started_at: 'asc',
        },
        with: {
            workout_exercises: {
                orderBy: { order: 'asc' },
                with: {
                    exercise: true,
                    sets: {
                        orderBy: { set_number: 'asc' },
                    },
                },
            },
        },
    });
}
