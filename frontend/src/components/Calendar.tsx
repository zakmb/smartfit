import React, { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import { useCheckin } from '../contexts/CheckinContext';
import { useSettings } from '../contexts/SettingsContext';
import CheckinList from './CheckinList';
import { CheckinDataUtils } from '../utils/CheckinDataUtils';
import EmptyStateMessage from './EmptyStateMessage';

export default function Calendar() {
  const { entries, deleteEntry } = useCheckin();
  const { filterEntries, settings } = useSettings();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Check if all settings are disabled
  const allSettingsDisabled = !settings.workoutEnabled && 
                              !settings.mealEnabled && 
                              !settings.weightEnabled && 
                              !settings.waterEnabled;

  // Get current month's data
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays: (Date | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  // Filter entries based on enabled settings
  const filteredEntries = filterEntries(entries);
  
  // Get entries for selected date
  const selectedDateEntries = CheckinDataUtils.getEntriesByDate(filteredEntries, selectedDate);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToPreviousYear = () => {
    setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
    setSelectedDate(new Date(currentYear - 1, currentMonth, 1));
  };

  const goToNextYear = () => {
    setCurrentDate(new Date(currentYear + 1, currentMonth, 1));
    setSelectedDate(new Date(currentYear + 1, currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value);
    setCurrentDate(new Date(currentYear, newMonth, 1));
    setSelectedDate(new Date(currentYear, newMonth, 1));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    setCurrentDate(new Date(newYear, currentMonth, 1));
    setSelectedDate(new Date(newYear, currentMonth, 1));
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'bg-orange-500';
      case 'meal':
        return 'bg-red-500';
      case 'weight':
        return 'bg-blue-500';
      case 'water':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate year options (current year ± 10 years)
  const currentYearNum = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYearNum - 10; year <= currentYearNum + 10; year++) {
    yearOptions.push(year);
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
          <p className="text-gray-400 mt-2">View your fitness activities by date</p>
        </div>

        {allSettingsDisabled ? (
          /* Empty State Message - shown when all preferences are disabled */
          <EmptyStateMessage />
        ) : (
          <>
            {/* Calendar Header */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            {/* Left side - Navigation controls */}
            <div className="flex items-center space-x-2">
              {/* Year navigation */}
              <button
                onClick={goToPreviousYear}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                title="Previous Year"
              >
                <ChevronDoubleLeftIcon className="h-4 w-4" />
              </button>
              
              {/* Month navigation */}
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                title="Previous Month"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              {/* Month and Year dropdowns */}
              <div className="flex items-center space-x-2 ml-4">
                <select
                  value={currentMonth}
                  onChange={handleMonthChange}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                
                <select
                  value={currentYear}
                  onChange={handleYearChange}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Next month and year navigation */}
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                title="Next Month"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={goToNextYear}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                title="Next Year"
              >
                <ChevronDoubleRightIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Right side - Today button */}
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Today
            </button>
          </div>

          {/* Current month/year display */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}

            {/* Calendar days */}
             {calendarDays.map((date, index) => {
               const isToday = date && date.toDateString() === new Date().toDateString();
               const isSelected = date && date.toDateString() === selectedDate.toDateString();
               const isCurrentMonth = date && date.getMonth() === currentMonth;
               const dayEntries = date ? CheckinDataUtils.getEntriesByDate(filteredEntries, date) : [];

              return (
                <div
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  className={`
                    min-h-[100px] p-2 border border-gray-700 cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 text-gray-500'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    ${isSelected ? 'ring-2 ring-green-500' : ''}
                  `}
                >
                  {date && (
                    <>
                      <div className="text-sm font-medium text-white mb-1">
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEntries.slice(0, 3).map((entry, entryIndex) => (
                          <div
                            key={entryIndex}
                            className={`w-2 h-2 rounded-full ${getTypeColor(entry.type)}`}
                            title={`${entry.type}: ${entry.title}`}
                          />
                        ))}
                        {dayEntries.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{dayEntries.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          <CheckinList
            entries={selectedDateEntries}
            onDeleteEntry={deleteEntry}
            showEmptyState={true}
            title=""
          />
        </div>
          </>
        )}
      </div>
    </div>
  );
} 