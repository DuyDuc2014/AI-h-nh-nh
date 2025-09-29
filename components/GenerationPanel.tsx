import React from 'react';

interface GenerationPanelProps {
  onGenerate: () => void;
  onPreview: () => void;
  isLoading: boolean;
  isPreviewLoading: boolean;
  generatedImage: string | null;
  isReady: boolean;
  isReadyForPreview: boolean;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const GenerationPanel: React.FC<GenerationPanelProps> = ({ 
  onGenerate, 
  onPreview, 
  isLoading, 
  isPreviewLoading, 
  generatedImage, 
  isReady,
  isReadyForPreview
}) => {
  const anyLoading = isLoading || isPreviewLoading;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Sẵn sàng sáng tạo?</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={onPreview}
              disabled={!isReadyForPreview || anyLoading}
              className="w-full bg-slate-700 text-slate-100 font-bold py-3 px-4 rounded-lg text-md hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
            >
              {isPreviewLoading ? (
                <div className="flex justify-center items-center">
                  <LoadingSpinner />
                  Đang xem...
                </div>
              ) : 'Xem trước'}
            </button>
            <button
              onClick={onGenerate}
              disabled={!isReady || anyLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg text-md transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <LoadingSpinner />
                  Đang tạo...
                </div>
              ) : 'Kết hợp hình ảnh'}
            </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Kết quả</h2>
        <div className="aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700">
          {generatedImage ? (
            <img src={generatedImage} alt="Generated masterpiece" className="w-full h-full object-contain rounded-lg" />
          ) : (
             <div className="text-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">Hình ảnh sẽ xuất hiện ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationPanel;
