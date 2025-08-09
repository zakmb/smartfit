import React from 'react';
import { ClockIcon, BoltIcon, FunnelIcon, FireIcon, CakeIcon } from '@heroicons/react/24/outline';
import type { DailyStats as DailyStatsType } from '../types/CheckinTypes';
import DailyStatsCard from './DailyStatsCard';
import { useSettings } from '../contexts/SettingsContext';

interface DailyStatsProps {
  stats: DailyStatsType;
}

export default function DailyStats({ stats }: DailyStatsProps) {
  const { isTypeEnabled } = useSettings();

  const statCards = [
    {
      icon: <BoltIcon />,
      title: 'Activities',
      value: stats.totalActivities,
      subtitle: 'workouts today',
      type: 'workout'
    },
    {
      icon: <ClockIcon />,
      title: 'Exercise Time',
      value: `${stats.totalWorkoutTime}min`,
      subtitle: 'total duration',
      type: 'workout'
    },
    {
      icon: <FunnelIcon />,
      title: 'Water',
      value: `${stats.totalWater}ml`,
      subtitle: 'intake today',
      type: 'water'
    },
    {
      icon: <CakeIcon />,
      title: 'Calories In',
      value: stats.totalCaloriesIn,
      subtitle: 'consumed today',
      type: 'meal'
    },
    {
      icon: <FireIcon />,
      title: 'Calories Burned',
      value: stats.totalCaloriesBurned,
      subtitle: 'burned today',
      type: 'workout'
    }
  ];

  // Filter cards based on enabled settings
  const enabledCards = statCards.filter(card => isTypeEnabled(card.type));

  if (enabledCards.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="text-gray-400 text-sm">
          <span className="mr-2">📈</span>
          No daily stats available with current preferences
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
        <span className="mr-2">📈</span>
        Daily Stats
      </h2>
      <div className={`grid gap-3 sm:gap-4 ${
        enabledCards.length === 1 
          ? 'grid-cols-1' 
          : enabledCards.length === 2 
          ? 'grid-cols-1 sm:grid-cols-2' 
          : enabledCards.length === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : enabledCards.length === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      }`}>
        {enabledCards.map((card, index) => (
          <DailyStatsCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
          />
        ))}
      </div>
    </div>
  );
} 