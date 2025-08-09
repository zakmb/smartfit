
import { useCheckin } from '../contexts/CheckinContext';
import { useSettings } from '../contexts/SettingsContext';
import { CheckinDataUtils, type TimePeriod } from '../utils/CheckinDataUtils';
import { useState } from 'react';
import StreakCard from './StreakCard';
import Graphs from './Graphs';
import DailyStats from './DailyStats';
import WeeklyStats from './WeeklyStats';
import EmptyStateMessage from './EmptyStateMessage';

export default function Dashboard() {
  const { entries, loading } = useCheckin();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');
  const { isTypeEnabled, settings } = useSettings();
  
  // Check if all settings are disabled
  const allSettingsDisabled = !settings.workoutEnabled && 
                              !settings.mealEnabled && 
                              !settings.weightEnabled && 
                              !settings.waterEnabled;
  if (loading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  // Filter entries based on enabled settings
  const filteredEntries = entries.filter(entry => isTypeEnabled(entry.type));
  
  // We'll calculate stats without icons since WeeklyStats will handle them
  const stats = CheckinDataUtils.calculateDashboardStats(filteredEntries, {
    BoltIcon: () => null,
    ClockIcon: () => null,
    FunnelIcon: () => null,
    CakeIcon: () => null,
    FireIcon: () => null
  });
  const streaks = CheckinDataUtils.calculateAllStreaks(entries);
  const dailyStats = CheckinDataUtils.calculateDailyStats(filteredEntries);

  // Filter streaks based on enabled settings
  const enabledStreaks = streaks.filter(streak => isTypeEnabled(streak.type));



  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Track your fitness journey and progress</p>
        </div>

        {allSettingsDisabled ? (
          /* Empty State Message - shown when all preferences are disabled */
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <EmptyStateMessage />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Streaks Section */}
            {enabledStreaks.length > 0 && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  <span className="mr-2">🔥</span>
                  Your Streaks
                </h2>
                <div className={`grid gap-4 sm:gap-6 ${
                  enabledStreaks.length === 1 
                    ? 'grid-cols-1 max-w-md mx-auto' 
                    : enabledStreaks.length === 2 
                    ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto' 
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                }`}>
                  {enabledStreaks.map((streak) => (
                    <StreakCard key={streak.type} streak={streak} />
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Section */}
            <div className="space-y-6">
              {/* Daily Statistics */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <DailyStats stats={dailyStats} />
              </div>

              {/* Weekly Statistics */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <WeeklyStats stats={stats} />
              </div>
            </div>

            {/* Graphs Section */}
            {filteredEntries.length > 0 && (
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <Graphs entries={filteredEntries} timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />
              </div>
            )}

            {/* Empty state for no data */}
            {filteredEntries.length === 0 && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 sm:p-12 text-center">
                <div className="text-4xl sm:text-6xl mb-4">📊</div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Data Yet</h3>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">Start tracking your fitness journey by adding your first check-in entry.</p>
                <a
                  href="/checkin"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                >
                  <span className="mr-2">➕</span>
                  Add First Entry
                </a>
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
} 