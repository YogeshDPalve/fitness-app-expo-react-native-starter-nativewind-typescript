import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  icon: () => '💪🏼',
  fields: [
    defineField({
      name: 'userId',
      title: 'User Id',
      description: 'The Clerk user Id of the person who performed this workout',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Workout Date',
      description: 'The date when workout was performed',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      description: 'The total duration of the workout in seconds',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'exercises',
      title: 'Workout Exercises',
      description: 'The exercises performed in this workout with sets, reps and weights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              description: 'The exercise that was performed',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              description: 'The sets performed for this exercise with reps and weights details',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'exerciseSet',
                  title: 'Exercise Set',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Repetitions',
                      description: 'The number of repetitions performed in this set',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      description: 'The weight used for this set',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      description: 'The unit of measurement for the weight',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Pounds (lbs)', value: 'lbs'},
                          {title: 'Kilograms (kgs)', value: 'kgs'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'lbs',
                    }),
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      weightUnit: 'weightUnit',
                    },
                    prepare({reps, weight, weightUnit}) {
                      return {
                        title: `Set: ${reps} reps`,
                        subtitle: weight ? `${weight} ${weightUnit}` : 'Bodyweight',
                      }
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              exercise: 'exercise.name',
              sets: 'sets',
            },
            prepare({exercise, sets}) {
              const setCount = sets?.length || 0
              return {
                title: exercise || 'Exercise',
                subtitle: `${setCount} set${setCount !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
    },
    prepare({date, duration, exercises}) {
      const workoutDate = date ? new Date(date).toLocaleDateString() : 'No date'
      const durationMinutes = duration ? Math.round(duration / 60) : 0
      const exerciseCount = exercises ? exercises.length : 0

      return {
        title: `Workout - ${workoutDate}`,
        subtitle: `${durationMinutes} min • ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
