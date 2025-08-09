import React from 'react';
import { Cog6ToothIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';

interface EmptyStateMessageProps {
  onOpenSettings?: () => void;
}

export default function EmptyStateMessage({ onOpenSettings }: EmptyStateMessageProps) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  
  // Check if all settings are disabled
  const allSettingsDisabled = !settings.workoutEnabled && 
                              !settings.mealEnabled && 
                              !settings.weightEnabled && 
                              !settings.waterEnabled;

  // Only show the component if all settings are disabled
  if (!allSettingsDisabled) {
    return null;
  }

  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      navigate('/personalization');
    }
  };

  return (
    <div className="p-6 sm:p-8 text-center">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6">
        <div className="bg-gray-700 rounded-full p-3 sm:p-4">
          <ExclamationCircleIcon className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            Nothing to Display
          </h3>
          <p className="text-gray-400 max-w-md text-sm sm:text-base">
            All content categories are currently disabled in your preferences. 
            Enable at least one category to see your fitness data and progress.
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 sm:p-4 w-full max-w-sm">
          <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3">Currently disabled:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-2 sm:px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
              🏋️ Workouts
            </span>
            <span className="px-2 sm:px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
              🍽️ Meals
            </span>
            <span className="px-2 sm:px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
              ⚖️ Weight
            </span>
            <span className="px-2 sm:px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
              💧 Water
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenSettings}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
        >
          <Cog6ToothIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Open Settings</span>
        </button>
      </div>
    </div>
  );
}