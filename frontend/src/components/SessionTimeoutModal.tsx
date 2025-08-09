import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtend: () => void;
}

export default function SessionTimeoutModal({ isOpen, onClose, onExtend }: SessionTimeoutModalProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const { logout } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300); // Reset to 5 minutes when modal opens
      
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            logout(); // Auto logout when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, logout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Session Timeout</h2>
            <p className="text-gray-300 mb-4">
              Your session will expire in <span className="font-bold text-yellow-400">{formatTime(timeLeft)}</span>
            </p>
            <p className="text-sm text-gray-400">
              Click "Stay Logged In" to extend your session, or you'll be automatically logged out.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout Now
            </button>
            <button
              onClick={onExtend}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 