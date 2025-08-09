import React from 'react';
import type { ReactElement } from 'react';

interface DailyStatsCardProps {
  icon: ReactElement;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  showChange?: boolean;
}

export default function DailyStatsCard({ 
  icon, 
  title, 
  value, 
  subtitle,
  change, 
  changeType, 
  showChange = false 
}: DailyStatsCardProps) {
  return (
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] h-full">
      <div className="flex items-start sm:items-center">
        <div className="flex-shrink-0">
          {React.cloneElement(icon, { className: "h-6 w-6 sm:h-8 sm:w-8 text-blue-400" } as any)}
        </div>
        <div className="ml-3 sm:ml-4 w-0 flex-1 min-w-0">
          <dl>
            <dt className="text-xs sm:text-sm font-medium text-white font-semibold truncate">{title}</dt>
            <dd className="text-lg sm:text-2xl font-semibold text-white truncate">{value}</dd>
            {subtitle && (
              <dd className="text-xs sm:text-sm text-gray-400 truncate">{subtitle}</dd>
            )}
          </dl>
        </div>
      </div>
      
      {showChange && change && (
        <div className="mt-3 sm:mt-4">
          <span className={`text-xs sm:text-sm ${
            changeType === 'positive' ? 'text-green-400' : 'text-red-400'
          }`}>
            {change}
          </span>
          <span className="text-xs sm:text-sm text-gray-400 ml-1">from last week</span>
        </div>
      )}
    </div>
  );
} 