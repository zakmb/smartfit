import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { type CheckinEntry } from '../types/CheckinTypes';
import { useSettings } from '../contexts/SettingsContext';

interface CheckinListProps {
  entries: CheckinEntry[];
  onDeleteEntry: (id: string) => Promise<void>;
  showEmptyState?: boolean;
  title?: string;
}

export default function CheckinList({
  entries,
  onDeleteEntry,
  showEmptyState = true,
  title = "Today's Entries"
}: CheckinListProps) {
  const { filterEntries } = useSettings();

  // Filter entries based on enabled settings
  const filteredEntries = filterEntries(entries);
  // Helper function to parse exercises from description
  const parseExercisesFromDescription = (description: string) => {
    if (!description) return null;
    
    const lines = description.split('\n');
    const exercises: Array<{name: string, sets: string, reps: string, weight: string, unit: string}> = [];
    let currentExercise: any = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('Exercise:')) {
        if (currentExercise) {
          exercises.push(currentExercise);
        }
        currentExercise = {
          name: trimmedLine.replace('Exercise:', '').trim(),
          sets: '?',
          reps: '?',
          weight: '0',
          unit: 'kg'
        };
      } else if (currentExercise && trimmedLine.startsWith('Sets:')) {
        currentExercise.sets = trimmedLine.replace('Sets:', '').trim();
      } else if (currentExercise && trimmedLine.startsWith('Reps:')) {
        currentExercise.reps = trimmedLine.replace('Reps:', '').trim();
      } else if (currentExercise && trimmedLine.startsWith('Weight:')) {
        const weightPart = trimmedLine.replace('Weight:', '').trim();
        const parts = weightPart.split(' ');
        currentExercise.weight = parts[0] || '0';
        currentExercise.unit = parts[1] || 'kg';
      }
    }
    
    if (currentExercise) {
      exercises.push(currentExercise);
    }
    
    return exercises.length > 0 ? exercises : null;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return "💪";
      case 'meal':
        return "🍽️";
      case 'weight':
        return "⚖️";
      case 'water':
        return "💧";
      case 'exercise':
        return "🏃";
      default:
        return <PlusIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'border-orange-500 bg-orange-500/10';
      case 'meal':
        return 'border-red-500 bg-red-500/10';
      case 'weight':
        return 'border-blue-500 bg-blue-500/10';
      case 'water':
        return 'border-cyan-500 bg-cyan-500/10';
      case 'exercise':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await onDeleteEntry(id);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      
      {filteredEntries.length === 0 && showEmptyState ? (
        <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-lg">
          <PlusIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No entries yet. Add your first activity!</p>
        </div>
      ) : (
        filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 ${getTypeColor(entry.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(entry.type)}
                </div>
                <div className="flex-1">
                  {/* Display details based on type */}
                  {entry.type === 'workout' && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="px-3 py-1 bg-orange-500/20 rounded-full">
                              <span className="text-orange-400 text-sm font-semibold uppercase tracking-wide">Workout</span>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            <span className="font-medium">{entry.duration} min</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Display exercises in structured format */}
                      {entry.description && parseExercisesFromDescription(entry.description) && (
                        <div className="mt-6">
                          <div className="flex items-center mb-4">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Exercises</h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {parseExercisesFromDescription(entry.description)?.map((exercise, index) => (
                              <div key={index} className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-4 border border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-white font-semibold text-lg truncate mr-2">{exercise.name}</h5>
                                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-orange-400 text-xs font-bold">{index + 1}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Sets</div>
                                    <div className="text-white font-bold text-base">{exercise.sets}</div>
                                  </div>
                                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Reps</div>
                                    <div className="text-white font-bold text-base">{exercise.reps}</div>
                                  </div>
                                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Weight</div>
                                    <div className="text-white font-bold text-base">{exercise.weight}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Display other description content if no exercises found */}
                      {entry.description && !parseExercisesFromDescription(entry.description) && (
                        <div className="mt-3 text-gray-400 whitespace-pre-line">
                          {entry.description}
                        </div>
                      )}
                    </>
                  )}
                  
                  {entry.type === 'exercise' && (
                    <>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="px-3 py-1 bg-yellow-500/20 rounded-full">
                          <span className="text-yellow-400 text-sm font-semibold uppercase tracking-wide">Exercise</span>
                        </div>
                      </div>
                      <div className="text-white font-semibold text-lg mb-2">{entry.title}</div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                          <span className="font-medium">{entry.duration} min</span>
                        </div>
                        {entry.calories && (
                          <div className="flex items-center text-gray-300">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                            <span className="font-medium">{entry.calories} cal</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {entry.type === 'meal' && (
                    <>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="px-3 py-1 bg-red-500/20 rounded-full">
                          <span className="text-red-400 text-sm font-semibold uppercase tracking-wide">Meal</span>
                        </div>
                      </div>
                      <div className="text-white font-semibold text-lg mb-2">{entry.title}</div>
                      {entry.calories && (
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                          <span className="font-medium">{entry.calories} cal</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {entry.type === 'weight' && (
                    <>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                          <span className="text-blue-400 text-sm font-semibold uppercase tracking-wide">Weight</span>
                        </div>
                      </div>
                      <div className="text-white font-semibold text-lg">{entry.weight} kg</div>
                    </>
                  )}
                  
                  {entry.type === 'water' && (
                    <>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="px-3 py-1 bg-cyan-500/20 rounded-full">
                          <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wide">Water</span>
                        </div>
                      </div>
                      <div className="text-white font-semibold text-lg">{entry.water} ml</div>
                    </>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleDeleteEntry(entry.id!)}
                className="text-gray-400 hover:text-red-400 transition-all duration-200 p-2 rounded-lg hover:bg-red-500/10 group"
              >
                <XMarkIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 