import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useToast, type Toast } from '../contexts/ToastContext';

interface ToastItemProps {
  toast: Toast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900/90 border-green-700/50';
      case 'error':
        return 'bg-red-900/90 border-red-700/50';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-700/50';
      case 'info':
      default:
        return 'bg-blue-900/90 border-blue-700/50';
    }
  };

  return (
    <div className={`
      flex items-center p-4 rounded-lg border shadow-lg backdrop-blur-sm transform transition-all duration-300 ease-in-out
      ${getBackgroundColor()}
    `}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-white font-medium">{toast.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={() => removeToast(toast.id)}
          className="inline-flex text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md"
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;