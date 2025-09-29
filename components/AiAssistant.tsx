import React from 'react';
import { SparklesIcon, DiceIcon } from './icons';

interface AiAssistantProps {
  onSuggest: () => void;
  onSurprise: () => void;
  isSuggesting: boolean;
  isSurprising: boolean;
  isReady: boolean;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const AiAssistant: React.FC<AiAssistantProps> = ({
  onSuggest,
  onSurprise,
  isSuggesting,
  isSurprising,
  isReady,
}) => {
  const anyLoading = isSuggesting || isSurprising;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <SparklesIcon className="w-8 h-8 text-purple-400 flex-shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-white">Trợ lý AI</h2>
          <p className="text-sm text-slate-400">Không biết bắt đầu từ đâu? Hãy để AI giúp bạn!</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onSuggest}
          disabled={!isReady || anyLoading}
          className="w-full bg-slate-700 text-slate-100 font-bold py-3 px-4 rounded-lg text-md hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
        >
          {isSuggesting ? (
            <div className="flex justify-center items-center">
              <LoadingSpinner />
              Đang phân tích...
            </div>
          ) : (
            <div className="flex justify-center items-center space-x-2">
              <SparklesIcon className="w-5 h-5" />
              <span>Phân tích & Gợi ý</span>
            </div>
          )}
        </button>
        <button
          onClick={onSurprise}
          disabled={anyLoading}
          className="w-full bg-slate-700 text-slate-100 font-bold py-3 px-4 rounded-lg text-md hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
        >
          {isSurprising ? (
            <div className="flex justify-center items-center">
              <LoadingSpinner />
              Đang nghĩ...
            </div>
          ) : (
             <div className="flex justify-center items-center space-x-2">
              <DiceIcon className="w-5 h-5" />
              <span>Tạo bất ngờ!</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
