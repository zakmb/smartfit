import React, { useState } from 'react';
import { TrophyIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface EditableGoalCardProps {
  currentWorkouts: number;
  goal: number;
  percentage: number;
  changeType: 'positive' | 'negative';
  onGoalChange: (newGoal: number) => void;
}

export default function EditableGoalCard({ 
  currentWorkouts, 
  goal, 
  percentage, 
  changeType, 
  onGoalChange 
}: EditableGoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal.toString());

  const handleSave = () => {
    const newGoal = parseInt(editValue, 10);
    if (newGoal > 0 && newGoal <= 14) { // Reasonable range: 1-14 workouts per week
      onGoalChange(newGoal);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(goal.toString());
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrophyIcon className="h-8 w-8 text-blue-400" />
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">Weekly Goal</dt>
              <dd className="text-2xl font-semibold text-white">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="bg-gray-700 text-white text-2xl font-semibold w-16 px-2 py-1 rounded border border-gray-600 focus:border-blue-400 focus:outline-none"
                      autoFocus
                    />
                    <span className="text-2xl font-semibold text-white">workouts</span>
                  </div>
                ) : (
                  `${currentWorkouts}/${goal}`
                )}
              </dd>
            </dl>
          </div>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded"
            title="Edit goal"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        )}
        
        {isEditing && (
          <div className="flex space-x-1">
            <button
              onClick={handleSave}
              className="text-green-400 hover:text-green-300 transition-colors p-1 rounded"
              title="Save"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-400 hover:text-red-300 transition-colors p-1 rounded"
              title="Cancel"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <span className={`text-sm ${
          changeType === 'positive' ? 'text-green-400' : 'text-red-400'
        }`}>
          {percentage}%
        </span>
        <span className="text-sm text-gray-400 ml-1">complete</span>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            changeType === 'positive' ? 'bg-green-400' : 'bg-red-400'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
} 