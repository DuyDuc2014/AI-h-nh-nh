import React from 'react';
import { RefreshIcon } from './icons';

interface OptionSelectorProps {
  title: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  customPlaceholder: string;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  title,
  options,
  selectedValue,
  onValueChange,
  customPlaceholder,
}) => {

  const handleReset = () => {
    onValueChange('');
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button 
          onClick={handleReset} 
          className="p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-purple-500 hover:text-purple-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          title="Làm mới lựa chọn"
        >
            <RefreshIcon className="w-5 h-5"/>
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Gợi ý {title.toLowerCase()}</h3>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onValueChange(option)}
              className={`text-center text-sm p-2.5 rounded-md transition-colors duration-200 ${
                selectedValue === option
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">Hoặc tự thêm</h3>
        <input
          type="text"
          value={selectedValue}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={customPlaceholder}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
        />
      </div>
    </div>
  );
};

export default OptionSelector;
