import React, { useState } from 'react';
import { 
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  FireIcon,
  ClockIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { useCheckin } from '../contexts/CheckinContext';

interface Todo {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'meal' | 'exercise' | 'weight' | 'water';
  duration?: number;
  calories?: number;
  exercises?: Array<{
    name: string;
    sets: string;
    reps: string;
    weight: string;
    unit: 'kg' | 'lbs';
  }>;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onTodoToggle: (id: string, completed: boolean) => void;
  showCompleted: boolean;
  onToggleShowCompleted: () => void;
}

export default function TodoList({ todos, onTodoToggle, showCompleted, onToggleShowCompleted }: TodoListProps) {
  const { addEntry } = useCheckin();
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [checkinData, setCheckinData] = useState({
    duration: '',
    calories: '',
    weight: '',
    water: '',
    exercises: [] as Array<{
      id: string;
      name: string;
      sets: string;
      reps: string;
      weight: string;
      unit: 'kg' | 'lbs';
    }>
  });

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleTodoToggle = async (todo: Todo) => {
    const newCompleted = !todo.completed;
    onTodoToggle(todo.id, newCompleted);
    
    if (newCompleted) {
      // Show checkin modal when completing a todo
      setSelectedTodo(todo);
      setCheckinData({
        duration: todo.duration?.toString() || '',
        calories: todo.calories?.toString() || '',
        weight: '',
        water: '',
        exercises: todo.exercises?.map(ex => ({
          id: Math.random().toString(36).substr(2, 9),
          ...ex
        })) || []
      });
      setShowCheckinModal(true);
    }
  };

  const handleCheckinSubmit = async () => {
    if (!selectedTodo) return;

    try {
      let entry: any = {
        type: selectedTodo.type,
        title: selectedTodo.title,
        description: selectedTodo.description,
        timestamp: new Date()
      };

      if (selectedTodo.type === 'workout') {
        entry.duration = checkinData.duration ? parseInt(checkinData.duration) : selectedTodo.duration;
        entry.calories = checkinData.calories ? parseInt(checkinData.calories) : selectedTodo.calories;
        entry.exercises = checkinData.exercises;
      } else if (selectedTodo.type === 'exercise') {
        entry.duration = checkinData.duration ? parseInt(checkinData.duration) : selectedTodo.duration;
        entry.calories = checkinData.calories ? parseInt(checkinData.calories) : selectedTodo.calories;
      } else if (selectedTodo.type === 'meal') {
        entry.calories = checkinData.calories ? parseInt(checkinData.calories) : selectedTodo.calories;
      } else if (selectedTodo.type === 'weight') {
        entry.weight = checkinData.weight ? parseFloat(checkinData.weight) : undefined;
      } else if (selectedTodo.type === 'water') {
        entry.water = checkinData.water ? parseInt(checkinData.water) : undefined;
      }

      await addEntry(entry);
      setShowCheckinModal(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error('Error creating checkin entry:', error);
    }
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
        return "📝";
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

  const renderTodo = (todo: Todo) => (
    <div
      key={todo.id}
      className={`bg-gray-800 rounded-lg p-4 border-l-4 ${getTypeColor(todo.type)} transition-all duration-200 hover:shadow-lg ${
        todo.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={() => handleTodoToggle(todo)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-400 hover:border-green-400'
          }`}
        >
          {todo.completed && <CheckIcon className="w-4 h-4" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getTypeIcon(todo.type)}</span>
              <h3 className={`font-semibold text-white ${todo.completed ? 'line-through' : ''}`}>
                {todo.title}
              </h3>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mt-1">{todo.description}</p>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
            {todo.duration && (
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {todo.duration} min
              </div>
            )}
            {todo.calories && (
              <div className="flex items-center">
                <FireIcon className="w-4 h-4 mr-1" />
                {todo.calories} cal
              </div>
            )}
            {todo.exercises && todo.exercises.length > 0 && (
              <div className="flex items-center">
                <ScaleIcon className="w-4 h-4 mr-1" />
                {todo.exercises.length} exercises
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Active Todos */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Active Tasks ({activeTodos.length})</h3>
        <div className="space-y-3">
          {activeTodos.length === 0 ? (
            <div className="text-center text-gray-400 py-8 bg-gray-800 rounded-lg">
              <CheckIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>All tasks completed! 🎉</p>
            </div>
          ) : (
            activeTodos.map(renderTodo)
          )}
        </div>
      </div>

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <button
            onClick={onToggleShowCompleted}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            {showCompleted ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
            <span>Completed Tasks ({completedTodos.length})</span>
          </button>
          
          {showCompleted && (
            <div className="space-y-3">
              {completedTodos.map(renderTodo)}
            </div>
          )}
        </div>
      )}

      {/* Checkin Modal */}
      {showCheckinModal && selectedTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Complete Task</h3>
              <button
                onClick={() => setShowCheckinModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">{selectedTodo.title}</h4>
              <p className="text-gray-300 text-sm">{selectedTodo.description}</p>
            </div>

            {/* Form fields based on todo type */}
            {(selectedTodo.type === 'workout' || selectedTodo.type === 'exercise') && (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={checkinData.duration}
                    onChange={(e) => setCheckinData({...checkinData, duration: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={selectedTodo.duration?.toString() || "30"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    value={checkinData.calories}
                    onChange={(e) => setCheckinData({...checkinData, calories: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={selectedTodo.calories?.toString() || "300"}
                  />
                </div>
              </div>
            )}

            {selectedTodo.type === 'meal' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Calories Consumed
                </label>
                <input
                  type="number"
                  value={checkinData.calories}
                  onChange={(e) => setCheckinData({...checkinData, calories: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={selectedTodo.calories?.toString() || "500"}
                />
              </div>
            )}

            {selectedTodo.type === 'weight' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={checkinData.weight}
                  onChange={(e) => setCheckinData({...checkinData, weight: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="70.5"
                />
              </div>
            )}

            {selectedTodo.type === 'water' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Water (ml)
                </label>
                <input
                  type="number"
                  value={checkinData.water}
                  onChange={(e) => setCheckinData({...checkinData, water: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={handleCheckinSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <CheckIcon className="w-5 h-5 mr-2" />
                Complete & Log
              </button>
              <button
                onClick={() => setShowCheckinModal(false)}
                className="px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 