import React from 'react';
import { 
  BoltIcon, 
  ClockIcon, 
  FunnelIcon, 
  CakeIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import type { DashboardStat } from '../utils/CheckinDataUtils';
import DailyStatsCard from './DailyStatsCard';
import { useSettings } from '../contexts/SettingsContext';

interface WeeklyStatsProps {
  stats: DashboardStat[];
}

export default function WeeklyStats({ stats }: WeeklyStatsProps) {
  const { isTypeEnabled } = useSettings();

  // Define the stat cards with their icons and types
  const statCards = [
    {
      icon: <BoltIcon />,
      title: 'Activities',
      type: 'workout'
    },
    {
      icon: <ClockIcon />,
      title: 'Exercise Time',
      type: 'workout'
    },
    {
      icon: <FunnelIcon />,
      title: 'Water Intake',
      type: 'water'
    },
    {
      icon: <CakeIcon />,
      title: 'Calories In',
      type: 'meal'
    },
    {
      icon: <FireIcon />,
      title: 'Calories Burned',
      type: 'workout'
    }
  ];

  // Combine stats with their card definitions
  const combinedStats = stats.map((stat, index) => ({
    ...stat,
    ...statCards[index]
  }));

  // Filter stats based on enabled settings
  const enabledStats = combinedStats.filter(stat => isTypeEnabled(stat.type));

  if (enabledStats.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="text-gray-400 text-sm">
          <span className="mr-2">📊</span>
          No weekly stats available with current preferences
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Week to Date Stats</h2>
      <div className={`grid gap-3 sm:gap-4 ${
        enabledStats.length === 1 
          ? 'grid-cols-1' 
          : enabledStats.length === 2 
          ? 'grid-cols-1 sm:grid-cols-2' 
          : enabledStats.length === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : enabledStats.length === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      }`}>
        {enabledStats.map((stat, index) => (
          <DailyStatsCard
            key={index}
            icon={stat.icon}
            title={stat.name}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            showChange={true}
          />
        ))}
      </div>
    </div>
  );
} 