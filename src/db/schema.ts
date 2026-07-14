import { defineRelations } from 'drizzle-orm';
import {
    integer,
    numeric,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';

export const exercises = pgTable('exercises', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const workouts = pgTable('workouts', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: text('user_id').notNull(),
    name: text('name'),
    started_at: timestamp('started_at'),
    completed_at: timestamp('completed_at'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const workout_exercises = pgTable('workout_exercises', {
    id: uuid('id').defaultRandom().primaryKey(),
    workout_id: uuid('workout_id')
        .notNull()
        .references(() => workouts.id, { onDelete: 'cascade' }),
    exercise_id: uuid('exercise_id')
        .notNull()
        .references(() => exercises.id, { onDelete: 'restrict' }),
    order: integer('order').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export const sets = pgTable('sets', {
    id: uuid('id').defaultRandom().primaryKey(),
    workout_exercise_id: uuid('workout_exercise_id')
        .notNull()
        .references(() => workout_exercises.id, { onDelete: 'cascade' }),
    set_number: integer('set_number').notNull(),
    weight: numeric('weight'),
    reps: integer('reps'),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export const schema = { exercises, workouts, workout_exercises, sets };

export const relations = defineRelations(schema, (r) => ({
    exercises: {
        workout_exercises: r.many.workout_exercises(),
    },
    workouts: {
        workout_exercises: r.many.workout_exercises(),
    },
    workout_exercises: {
        workout: r.one.workouts({
            from: r.workout_exercises.workout_id,
            to: r.workouts.id,
        }),
        exercise: r.one.exercises({
            from: r.workout_exercises.exercise_id,
            to: r.exercises.id,
        }),
        sets: r.many.sets(),
    },
    sets: {
        workout_exercise: r.one.workout_exercises({
            from: r.sets.workout_exercise_id,
            to: r.workout_exercises.id,
        }),
    },
}));
