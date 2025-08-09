export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
  unit: 'kg' | 'lbs';
}

export interface CheckinEntry {
  id?: string;
  userId?: string;
  type: 'WORKOUT' | 'EXERCISE' | 'MEAL' | 'WEIGHT' | 'WATER' | 'workout' | 'exercise' | 'meal' | 'weight' | 'water';
  title: string;
  description: string;
  calories?: number;
  duration?: number;
  weight?: number;
  water?: number;
  exercises?: Exercise[];
  timestamp: string;
}

export interface FormData {
  type: 'workout' | 'meal' | 'weight' | 'water' | 'exercise';
  // workout
  exercises: Exercise[];
  duration: string;
  // meal
  meal: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealCalories: number;
  // exercise
  exerciseType: string;
  exerciseDuration: string;
  exerciseDistance: string;
  exerciseCalories: number;
  customExerciseType?: string;
  // shared
  weight: string;
  water: string;
}

export interface DailyStats {
  totalWorkoutTime: number;
  totalActivities: number;
  totalWater: number;
  totalCaloriesIn: number;
  totalCaloriesBurned: number;
}

export const CARDIO_OPTIONS = [
  'Running', 'Cycling', 'Rowing', 'Elliptical', 'Swimming', 'Walking', 'Other'
];

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export const ENTRY_TYPES = ['workout', 'meal', 'weight', 'water', 'exercise'] as const; 