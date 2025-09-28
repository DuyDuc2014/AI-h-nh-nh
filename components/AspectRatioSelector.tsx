import React from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIO_OPTIONS } from '../constants';

interface AspectRatioSelectorProps {
  selectedValue: AspectRatio;
  onValueChange: (value: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedValue, onValueChange }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Bước 6: Chọn tỷ lệ</h2>
      <div className="grid grid-cols-2 gap-2">
        {ASPECT_RATIO_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onValueChange(value)}
            className={`text-center text-sm p-2.5 rounded-md transition-colors duration-200 ${
              selectedValue === value
                ? 'bg-purple-600 text-white font-semibold shadow-lg'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
