import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useCheckin } from '../contexts/CheckinContext';
import AddCheckin from './AddCheckin';
import CheckinList from './CheckinList';
import { CheckinDataUtils } from '../utils/CheckinDataUtils';
import EmptyStateMessage from './EmptyStateMessage';
import { useSettings } from '../contexts/SettingsContext';

export default function Checkin() {
  const { entries, addEntry, deleteEntry } = useCheckin();
  const { settings } = useSettings();
  const [showForm, setShowForm] = useState(false);

  const todayEntries = CheckinDataUtils.getTodayEntries(entries);
  
  // Check if all settings are disabled
  const allSettingsDisabled = !settings.workoutEnabled && 
                              !settings.mealEnabled && 
                              !settings.weightEnabled && 
                              !settings.waterEnabled;

  const handleAddEntry = async (entry: any) => {
    await addEntry(entry);
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
  };

    return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Daily Check-in</h1>
          <p className="text-gray-400 mt-2">Log your fitness activities and track your progress</p>
        </div>

        {allSettingsDisabled ? (
          /* Empty State Message - shown when all preferences are disabled */
          <EmptyStateMessage />
        ) : (
          <>
            {/* Add Entry Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Entry
              </button>
            </div>

            {/* Add Entry Form */}
            {showForm && (
              <AddCheckin 
                onAddEntry={handleAddEntry}
                onClose={() => setShowForm(false)}
              />
            )}

            {/* Entries List */}
            <CheckinList 
              entries={todayEntries}
              onDeleteEntry={handleDeleteEntry}
            />
          </>
        )}
      </div>
    </div>
  );
}  