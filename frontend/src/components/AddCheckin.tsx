import React, { useState } from 'react';
import { 
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { 
  type FormData, 
  type Exercise, 
  CARDIO_OPTIONS, 
  MEAL_TYPES,
  ENTRY_TYPES
} from '../types/CheckinTypes';

interface AddCheckinProps {
  onAddEntry: (entry: any) => Promise<void>;
  onClose: () => void;
}

export default function AddCheckin({ onAddEntry, onClose }: AddCheckinProps) {
  const { currentUser } = useAuth();
  const { getEnabledTypes } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState(false);
  // Get enabled entry types based on settings
  const enabledTypes = getEnabledTypes();
  
  // Initialize form with first enabled type, or default to 'workout' if none enabled
  const getInitialType = (): FormData['type'] => {
    if (enabledTypes.length === 0) return 'workout';
    return enabledTypes[0] as FormData['type'];
  };

  const [formData, setFormData] = useState<FormData>({
    type: getInitialType(),
    exercises: [],
    duration: '',
    meal: '',
    mealType: 'breakfast',
    mealCalories: 500,
    exerciseType: CARDIO_OPTIONS[0],
    exerciseDuration: '',
    exerciseDistance: '',
    exerciseCalories: 300,
    customExerciseType: '',
    weight: '',
    water: ''
  });

  // Helper function to generate unique ID for exercises
  const generateExerciseId = () => Math.random().toString(36).substr(2, 9);

  // Helper component for displaying single global validation info (like login page)
  const GlobalValidationInfo = () => {
    if (!formTouched) return null;
    const firstError = getFirstError();
    if (!firstError) return null;
    
    return (
      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-center text-blue-400 text-sm">
          <span className="mr-2">ℹ️</span>
          {firstError}
        </div>
      </div>
    );
  };

  // Helper function to format exercises for display
  const formatExercisesForDisplay = (exercises: Exercise[]) => {
    if (!exercises || exercises.length === 0) return '';
    
    return exercises
      .filter(ex => ex.name.trim())
      .map(ex => {
        const lines = [
          `Exercise: ${ex.name}`,
          `    Sets: ${ex.sets || '?'}`,
          `    Reps: ${ex.reps || '?'}`,
          `    Weight: ${ex.weight || '0'}${ex.unit}`
        ];
        return lines.join('\n');
      })
      .join('\n\n');
  };

  // Add new exercise to the list
  const addExercise = () => {
    const newExercise: Exercise = {
      id: generateExerciseId(),
      name: '',
      sets: '',
      reps: '',
      weight: '',
      unit: 'kg'
    };
    setFormData({
      ...formData,
      exercises: [...formData.exercises, newExercise]
    });
  };

  // Update specific exercise
  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    });
  };

  // Remove exercise from list
  const removeExercise = (id: string) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter(ex => ex.id !== id)
    });
  };

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    if (formData.type === 'workout') {
      if (!formData.duration?.trim()) {
        errors.duration = 'Duration is required for workouts';
      } else if (parseInt(formData.duration) <= 0) {
        errors.duration = 'Duration must be a positive number';
      }
      
      if (formData.exercises.length === 0) {
        errors.exercises = 'At least one exercise is required';
      } else {
        for (let i = 0; i < formData.exercises.length; i++) {
          const exercise = formData.exercises[i];
          if (!exercise.name.trim()) {
            errors[`exercise_${i}_name`] = 'Exercise name is required';
          }
          if (!exercise.sets.trim()) {
            errors[`exercise_${i}_sets`] = 'Sets is required';
          } else if (parseInt(exercise.sets) <= 0) {
            errors[`exercise_${i}_sets`] = 'Sets must be a positive number';
          }
          if (!exercise.reps.trim()) {
            errors[`exercise_${i}_reps`] = 'Reps is required';
          } else if (parseInt(exercise.reps) <= 0) {
            errors[`exercise_${i}_reps`] = 'Reps must be a positive number';
          }
          if (!exercise.weight.trim()) {
            errors[`exercise_${i}_weight`] = 'Weight is required';
          } else if (parseFloat(exercise.weight) < 0) {
            errors[`exercise_${i}_weight`] = 'Weight must be a positive number';
          }
        }
      }
    } else if (formData.type === 'meal') {
      if (!formData.meal.trim()) {
        errors.meal = 'Meal name is required';
      }
      if (!formData.mealCalories || formData.mealCalories <= 0) {
        errors.mealCalories = 'Calories must be a positive number';
      }
    } else if (formData.type === 'exercise') {
      if (!formData.exerciseDuration || parseInt(formData.exerciseDuration) <= 0) {
        errors.exerciseDuration = 'Duration must be a positive number';
      }
      if (!formData.exerciseCalories || formData.exerciseCalories <= 0) {
        errors.exerciseCalories = 'Calories must be a positive number';
      }
      if (formData.exerciseType === 'Other' && !formData.customExerciseType?.trim()) {
        errors.customExerciseType = 'Please specify the exercise type';
      }
      if (formData.exerciseDistance && parseFloat(formData.exerciseDistance) < 0) {
        errors.exerciseDistance = 'Distance must be a positive number';
      }
    } else if (formData.type === 'weight') {
      if (!formData.weight?.trim()) {
        errors.weight = 'Weight is required';
      } else if (parseFloat(formData.weight) <= 0) {
        errors.weight = 'Weight must be a positive number';
      }
    } else if (formData.type === 'water') {
      if (!formData.water?.trim()) {
        errors.water = 'Water amount is required';
      } else if (parseInt(formData.water) <= 0) {
        errors.water = 'Water amount must be a positive number';
      }
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const createEntryFromFormData = () => {
    const baseEntry = {
      type: formData.type,
      title: '',
      description: '',
      timestamp: new Date()
    };

    switch (formData.type) {
      case 'workout':
        return {
          ...baseEntry,
          title: 'Workout',
          description: formatExercisesForDisplay(formData.exercises),
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          exercises: formData.exercises.filter(ex => ex.name.trim())
        };
      case 'exercise':
        return {
          ...baseEntry,
          title: formData.exerciseType === 'Other' ? (formData.customExerciseType || 'Custom Exercise') : (formData.exerciseType || 'Exercise'),
          description: `Duration: ${formData.exerciseDuration || 0} minutes`,
          duration: formData.exerciseDuration ? parseInt(formData.exerciseDuration) : undefined,
          calories: formData.exerciseCalories || 100
        };
      case 'meal':
        return {
          ...baseEntry,
          title: formData.meal || 'Meal',
          description: `Type: ${formData.mealType}`,
          calories: formData.mealCalories || 500
        };
      case 'weight':
        return {
          ...baseEntry,
          title: `Weight: ${formData.weight} kg`,
          weight: formData.weight ? parseFloat(formData.weight) : undefined
        };
      case 'water':
        return {
          ...baseEntry,
          title: `Water: ${formData.water} ml`,
          water: formData.water ? parseInt(formData.water) : undefined
        };
      default:
        return baseEntry;
    }
  };

  // Real-time validation effect - only after form is touched
  React.useEffect(() => {
    if (formTouched) {
      const validation = validateForm();
      setValidationErrors(validation.errors);
    }
  }, [formData, formTouched]);

  const isFormValid = () => {
    const validation = validateForm();
    return validation.isValid;
  };

  // Get the first error to display (like login page)
  const getFirstError = () => {
    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length === 0) return '';
    return validationErrors[errorKeys[0]];
  };

  // Mark form as touched when user interacts with any input
  const handleFormTouch = () => {
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleAddEntry = async () => {
    if (!currentUser || isSubmitting) return;
    
    const validation = validateForm();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const entry = createEntryFromFormData();
      await onAddEntry(entry);
      onClose();
    } catch (error) {
      alert('Failed to create entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-8 mb-6 shadow-2xl border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Add New Entry</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      {enabledTypes.length === 0 ? (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <p className="text-gray-300 text-center">
            No check-in types are enabled. Please enable at least one type in your personalization settings.
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-3">Entry Type</label>
          <select
            value={formData.type}
            onChange={(e) => {
              const newType = e.target.value as FormData['type'];
              setFormData({ 
                ...formData, 
                type: newType,
                exercises: newType === 'workout' && formData.exercises.length === 0 
                  ? [{ id: generateExerciseId(), name: '', sets: '', reps: '', weight: '', unit: 'kg' }]
                  : formData.exercises
              });
            }}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
          >
            {enabledTypes.includes('workout') && <option value="workout">💪 Workout</option>}
            {enabledTypes.includes('meal') && <option value="meal">🍽️ Meal</option>}
            {enabledTypes.includes('exercise') && <option value="exercise">🏃 Exercise</option>}
            {enabledTypes.includes('weight') && <option value="weight">⚖️ Weight</option>}
            {enabledTypes.includes('water') && <option value="water">💧 Water</option>}
          </select>
        </div>
      )}

      {/* Global Info Display */}
      <GlobalValidationInfo />

      {/* Workout Fields */}
      {formData.type === 'workout' && (
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Exercises</label>
            <div className="space-y-4">
              {formData.exercises.map((exercise) => (
                <div key={exercise.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => {
                          handleFormTouch();
                          updateExercise(exercise.id, 'name', e.target.value);
                        }}
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 text-sm transition-all duration-200"
                        placeholder="Exercise name (e.g. Squats)"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => {
                          handleFormTouch();
                          updateExercise(exercise.id, 'sets', e.target.value);
                        }}
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg text-white text-center p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Sets"
                        required
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-gray-400 font-medium text-lg">×</span>
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => {
                          handleFormTouch();
                          updateExercise(exercise.id, 'reps', e.target.value);
                        }}
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg text-white text-center p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Reps"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={exercise.weight}
                        onChange={(e) => {
                          handleFormTouch();
                          updateExercise(exercise.id, 'weight', e.target.value);
                        }}
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg text-white text-center p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Weight"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={exercise.unit}
                        onChange={(e) => updateExercise(exercise.id, 'unit', e.target.value as 'kg' | 'lbs')}
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg text-white text-center p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                      </select>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeExercise(exercise.id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-all duration-200"
                        title="Remove exercise"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExercise}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center border-2 border-dashed border-blue-400 hover:border-blue-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <PlusIcon className="h-6 w-6 mr-3" />
                Add Exercise
              </button>
              {formData.exercises.length === 0 && (
                <p className="text-gray-400 text-sm italic text-center py-4">Add exercises to track your workout details</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => {
                  handleFormTouch();
                  setFormData({ ...formData, duration: e.target.value });
                }}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="45"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Meal Fields */}
      {formData.type === 'meal' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Meal</label>
            <input
              type="text"
              value={formData.meal}
              onChange={(e) => {
                handleFormTouch();
                setFormData({ ...formData, meal: e.target.value });
              }}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Chicken Salad"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Meal Type</label>
            <select
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value as FormData['mealType'] })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {MEAL_TYPES.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Calories</label>
            <input
              type="number"
              min="1"
              value={formData.mealCalories}
              onChange={(e) => {
                handleFormTouch();
                setFormData({ ...formData, mealCalories: Number(e.target.value) });
              }}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="500"
              required
            />
          </div>
        </div>
      )}

      {/* Exercise Fields */}
      {formData.type === 'exercise' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Exercise Type</label>
            <select
              value={formData.exerciseType}
              onChange={(e) => setFormData({ 
                ...formData, 
                exerciseType: e.target.value,
                customExerciseType: e.target.value === 'Other' ? formData.customExerciseType : ''
              })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {CARDIO_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {formData.exerciseType === 'Other' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">Specify Exercise Type</label>
                <input
                  type="text"
                  value={formData.customExerciseType}
                  onChange={(e) => {
                    handleFormTouch();
                    setFormData({ ...formData, customExerciseType: e.target.value });
                  }}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Yoga, Pilates, Boxing, etc."
                  required
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              min="1"
              value={formData.exerciseDuration}
              onChange={(e) => {
                handleFormTouch();
                setFormData({ ...formData, exerciseDuration: e.target.value });
              }}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Distance (km)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.exerciseDistance}
              onChange={(e) => {
                handleFormTouch();
                setFormData({ ...formData, exerciseDistance: e.target.value });
              }}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Calories</label>
            <input
              type="number"
              min="1"
              value={formData.exerciseCalories}
              onChange={(e) => {
                handleFormTouch();
                setFormData({ ...formData, exerciseCalories: Number(e.target.value) });
              }}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="300"
              required
            />
          </div>
        </div>
      )}

      {/* Weight Fields */}
      {formData.type === 'weight' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={formData.weight}
            onChange={(e) => {
              handleFormTouch();
              setFormData({ ...formData, weight: e.target.value });
            }}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="70.5"
            required
          />
        </div>
      )}

      {/* Water Fields */}
      {formData.type === 'water' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Water (ml)</label>
          <input
            type="number"
            min="1"
            value={formData.water}
            onChange={(e) => {
              handleFormTouch();
              setFormData({ ...formData, water: e.target.value });
            }}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="500"
            required
          />
        </div>
      )}

      <div className="flex gap-4 pt-6 border-t border-gray-700">
        <button
          onClick={handleAddEntry}
          disabled={isSubmitting || enabledTypes.length === 0 || (formTouched && !isFormValid())}
          className={`flex-1 font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg transform ${
            isSubmitting || enabledTypes.length === 0
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed shadow-none transform-none border-2 border-gray-400'
              : (formTouched && !isFormValid())
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed shadow-none transform-none border-2 border-gray-400'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl hover:scale-[1.02]'
          }`}
        >
          <CheckIcon className="h-5 w-5 mr-2" />
          {isSubmitting 
            ? 'Saving...' 
            : enabledTypes.length === 0 
            ? 'No Types Enabled' 
            : (formTouched && !isFormValid()) 
            ? 'Please Complete All Details' 
            : 'Save Entry'
          }
        </button>
        <button
          onClick={onClose}
          className="px-8 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <XMarkIcon className="h-5 w-5 mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
} 