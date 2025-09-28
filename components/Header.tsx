import React from 'react';
import { UndoIcon, RedoIcon } from './icons';

interface HeaderProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Header: React.FC<HeaderProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
  return (
    <header className="relative text-center w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="absolute top-8 md:top-12 right-4 flex items-center space-x-2">
            <button 
                onClick={onUndo} 
                disabled={!canUndo}
                className="p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 transition-colors"
                aria-label="Undo change"
                title="Hoàn tác"
            >
                <UndoIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 transition-colors"
                aria-label="Redo change"
                title="Làm lại"
            >
                <RedoIcon className="w-5 h-5" />
            </button>
        </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
        AI Hoán Đổi Gương Mặt
      </h1>
      <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
        Tạo ra những hình ảnh mới tuyệt đẹp bằng cách kết hợp khuôn mặt của bạn với các ý tưởng sáng tạo.
      </p>
      <div className="mt-4 inline-block bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium px-4 py-1 rounded-full">
        APP được thiết kế bởi LÊ VŨ
      </div>
    </header>
  );
};

export default Header;
