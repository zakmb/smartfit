import React from 'react';
import { FireIcon, FunnelIcon, ScaleIcon } from '@heroicons/react/24/outline';
import type { StreakInfo } from '../utils/CheckinDataUtils';

interface StreakCardProps {
  streak: StreakInfo;
}

export default function StreakCard({ streak }: StreakCardProps) {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return FireIcon;
      case 'water':
        return FunnelIcon;
      case 'weight':
        return ScaleIcon;
      default:
        return FireIcon;
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'workout':
        return 'Activity Streak';
      case 'water':
        return 'Water Tracking Streak';
      case 'weight':
        return 'Weight Tracking Streak';
      default:
        return 'Streak';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'text-orange-400';
      case 'water':
        return 'text-cyan-400';
      case 'weight':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'bg-orange-500';
      case 'water':
        return 'bg-cyan-500';
      case 'weight':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  const Icon = getIcon(streak.type);
  const title = getTitle(streak.type);
  const iconColor = getColor(streak.type);
  const bgColor = getBgColor(streak.type);

  return (
    <div className={`bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] h-full ${streak.isRunningOut ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center min-w-0 flex-1">
          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor} flex-shrink-0`} />
          <h3 className="text-sm sm:text-lg font-semibold text-white ml-2 sm:ml-3 truncate">{title}</h3>
        </div>
        <div className={`px-2 sm:px-3 py-1 rounded-full ${streak.isRunningOut ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg' : bgColor} text-white text-xs sm:text-sm font-bold ${streak.isRunningOut ? 'animate-pulse' : ''} flex-shrink-0 ml-2`}>
          {streak.current} days
        </div>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-xs sm:text-sm">Current Streak</span>
          <span className="text-white font-semibold text-sm sm:text-base">{streak.current} days</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-xs sm:text-sm">Longest Streak</span>
          <span className="text-white font-semibold text-sm sm:text-base">{streak.longest} days</span>
        </div>
        
        {streak.longest > 0 && (
          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress to Best</span>
              <span>{Math.round((streak.current / streak.longest) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className={`${bgColor} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min((streak.current / streak.longest) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {streak.current > 0 && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-800 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-300">
            {streak.isRunningOut ? 
              'Your streak is running out! Log an entry today to keep it alive! 🔥' :
              streak.current === 1 ? 'Great start! Keep it going!' :
              streak.current === streak.longest ? 'New personal best! 🎉' :
              `You're ${streak.longest - streak.current} days away from your best streak!`}
          </p>
        </div>
      )}
    </div>
  );
} 