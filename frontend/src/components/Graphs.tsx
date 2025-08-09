import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { CheckinDataUtils, type TimePeriod } from '../utils/CheckinDataUtils';
import type { CheckinEntry } from '../types/CheckinTypes';
import { useSettings } from '../contexts/SettingsContext';

interface GraphsProps {
  entries: CheckinEntry[];
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
}

const TimePeriodToggle = ({ currentPeriod, onPeriodChange }: { 
  currentPeriod: TimePeriod; 
  onPeriodChange: (period: TimePeriod) => void; 
}) => (
  <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
    {(['weekly', 'monthly', 'yearly'] as TimePeriod[]).map((period) => (
      <button
        key={period}
        onClick={() => onPeriodChange(period)}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          currentPeriod === period
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-600'
        }`}
      >
        {period.charAt(0).toUpperCase() + period.slice(1)}
      </button>
    ))}
  </div>
);

export default function Graphs({ entries, timePeriod, onTimePeriodChange }: GraphsProps) {
  const { isTypeEnabled } = useSettings();
  const chartData = CheckinDataUtils.getDataForPeriod(entries, timePeriod);
  const weightData = CheckinDataUtils.getWeightDataForPeriod(entries, timePeriod);

  // Check which graphs should be shown based on settings
  const showActivityChart = isTypeEnabled('workout') || isTypeEnabled('exercise');
  const showWorkoutsChart = isTypeEnabled('workout') || isTypeEnabled('exercise');
  const showWeightChart = isTypeEnabled('weight');
  const showWaterChart = isTypeEnabled('water');

  // Check if any graphs are enabled
  const hasEnabledGraphs = showActivityChart || showWorkoutsChart || showWeightChart || showWaterChart;

  if (!hasEnabledGraphs) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Analytics & Progress</h2>
        <TimePeriodToggle currentPeriod={timePeriod} onPeriodChange={onTimePeriodChange} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        {showActivityChart && (
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="#E2E8F0" fontSize={12} />
                <YAxis stroke="#E2E8F0" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#60A5FA" 
                  strokeWidth={3}
                  name="Calories"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#34D399" 
                  strokeWidth={3}
                  name="Duration (min)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Chart Legend */}
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-1 bg-blue-400 mr-2 rounded-full shadow-sm"></div>
                <span className="text-sm text-slate-200 font-medium">Calories Burned</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-emerald-400 mr-2 rounded-full shadow-sm"></div>
                <span className="text-sm text-slate-200 font-medium">Duration (minutes)</span>
              </div>
            </div>
          </div>
        )}

        {/* Workouts Bar Chart */}
        {showWorkoutsChart && (
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4">Workouts</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="#E2E8F0" fontSize={12} />
                <YAxis stroke="#E2E8F0" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                  }}
                />
                <Bar 
                  dataKey="workouts" 
                  fill="url(#workoutGradient)" 
                  radius={[6, 6, 0, 0]}
                  stroke="#1E40AF"
                  strokeWidth={1}
                />
                <defs>
                  <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Chart Legend */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 mr-2 rounded shadow-sm"></div>
                <span className="text-sm text-slate-200 font-medium">Number of Workouts</span>
              </div>
            </div>
          </div>
        )}

        {/* Weight Chart */}
        {showWeightChart && (
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4">Weight Progress</h3>
            {weightData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.5} />
                    <XAxis dataKey="date" stroke="#E2E8F0" fontSize={12} />
                    <YAxis stroke="#E2E8F0" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E293B', 
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#A855F7" 
                      fill="url(#weightGradient)" 
                      strokeWidth={3}
                      name="Weight (kg)"
                    />
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
                
                {/* Chart Legend */}
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-600 mr-2 rounded shadow-sm"></div>
                    <span className="text-sm text-slate-200 font-medium">Weight (kg)</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                No weight data available
              </div>
            )}
          </div>
        )}

        {/* Water Intake Chart */}
        {showWaterChart && (
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4">Water Intake</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="#E2E8F0" fontSize={12} />
                <YAxis stroke="#E2E8F0" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                  }}
                />
                <Bar 
                  dataKey="water" 
                  fill="url(#waterGradient)" 
                  radius={[6, 6, 0, 0]}
                  stroke="#0891B2"
                  strokeWidth={1}
                  name="Water (ml)" 
                />
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Chart Legend */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-cyan-600 mr-2 rounded shadow-sm"></div>
                <span className="text-sm text-slate-200 font-medium">Water Intake (ml)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}