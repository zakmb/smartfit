import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';

export default function PersonalizationPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { settings, saveSettings, loading, error } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [originalSettings, setOriginalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local settings when component mounts or settings change
  useEffect(() => {
    setOriginalSettings(settings);
    setLocalSettings(settings);
  }, [settings]);

  const handleToggleSetting = (key: keyof typeof settings) => {
    const newLocalSettings = {
      ...localSettings,
      [key]: !localSettings[key]
    };
    
    // Only update local state for the page - no dashboard updates until save
    setLocalSettings(newLocalSettings);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveSettings(localSettings);
      addToast('Settings saved successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save settings:', error);
      addToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset local settings to original - no need to revert dashboard since it was never changed
    setLocalSettings(originalSettings);
  };

  const checkinTypes = [
    { 
      key: 'workoutEnabled' as const, 
      label: 'Workout & Exercise', 
      description: 'Track your workout sessions and individual exercises (cardio, strength training, etc.)',
      impact: 'Hidden from dashboard stats, calendar, and check-in form'
    },
    { 
      key: 'mealEnabled' as const, 
      label: 'Meal', 
      description: 'Log your meals and nutrition intake',
      impact: 'Hidden from dashboard stats, calendar, and check-in form'
    },
    { 
      key: 'weightEnabled' as const, 
      label: 'Weight', 
      description: 'Monitor your weight progress over time',
      impact: 'Hidden from dashboard stats, calendar, and check-in form'
    },
    { 
      key: 'waterEnabled' as const, 
      label: 'Water', 
      description: 'Track your daily water intake',
      impact: 'Hidden from dashboard stats, calendar, and check-in form'
    },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Personalization Settings</h1>
          <p className="text-gray-400">Customize which features you want to see and use in your SmartFit experience.</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="mb-6 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> When you disable a check-in type, it will be hidden from your dashboard, calendar, and forms. However, all your previous data will be safely stored and can be restored by re-enabling the type.
            </p>
          </div>
              
          <div className="grid gap-4 md:grid-cols-2">
            {checkinTypes.map(({ key, label, description, impact }) => (
              <div key={key} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-white mb-1">{label}</h4>
                    <p className="text-sm text-gray-400">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting(key)}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-700 ml-4
                      ${localSettings[key] ? 'bg-blue-600' : 'bg-gray-600'}
                    `}
                    role="switch"
                    aria-checked={localSettings[key]}
                  >
                    <span
                      className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                        ${localSettings[key] ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
                {!localSettings[key] && (
                  <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded">
                    <p className="text-xs text-yellow-300">
                      <strong>Currently disabled:</strong> {impact}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
              <p className="text-sm text-red-300">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}



          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="button"
              disabled={isSaving || loading}
              className="inline-flex justify-center px-6 py-3 text-sm font-semibold rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              disabled={isSaving || loading}
              className="inline-flex justify-center px-6 py-3 text-sm font-semibold rounded-md bg-gray-600 text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}