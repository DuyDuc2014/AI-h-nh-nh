import React from 'react';
import { CloseIcon } from './icons';

interface ErrorMessageProps {
  message: string | null;
  onDismiss: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 w-11/12 max-w-lg bg-red-800/80 backdrop-blur-sm border border-red-600 text-white p-4 rounded-xl shadow-2xl z-50"
      role="alert"
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-grow text-sm font-medium">{message}</div>
        <button
          onClick={onDismiss}
          className="ml-4 -mr-1 p-1 rounded-full text-red-200 hover:bg-red-700/50 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
          aria-label="Dismiss"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
