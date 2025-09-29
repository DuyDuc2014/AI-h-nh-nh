import React from 'react';

interface GenerationPanelProps {
  onGenerate: () => void;
  isLoading: boolean;
  isPreviewLoading: boolean;
  generatedImage: string | null;
  isReady: boolean;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const GenerationPanel: React.FC<GenerationPanelProps> = ({ 
  onGenerate, 
  isLoading, 
  isPreviewLoading, 
  generatedImage, 
  isReady,
}) => {
  const anyLoading = isLoading || isPreviewLoading;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Sẵn sàng sáng tạo?</h2>
        <p className="text-sm text-slate-400 mt-1">Ảnh xem trước sẽ tự động cập nhật bên dưới khi bạn thay đổi các tùy chọn.</p>
        <div className="mt-4">
            <button
              onClick={onGenerate}
              disabled={!isReady || anyLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg text-md transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <LoadingSpinner />
                  Đang tạo ảnh...
                </div>
              ) : (
                'Tạo ảnh chất lượng cao'
              )}
            </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Kết quả (Xem trước trực tiếp)</h2>
        <div className="aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700 relative overflow-hidden">
          {(isLoading || isPreviewLoading) && (
             <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity duration-300">
                <LoadingSpinner />
                <p className="mt-2 text-sm text-slate-300 font-medium">
                  {isLoading ? 'Đang tạo ảnh chất lượng cao...' : 'Đang cập nhật xem trước...'}
                </p>
                {isLoading && <p className="mt-1 text-xs text-slate-400">Vui lòng chờ một lát</p>}
            </div>
          )}

          {generatedImage ? (
            <img 
              src={generatedImage} 
              alt="Generated masterpiece" 
              className={`w-full h-full object-contain rounded-lg transition-opacity duration-300 ${isPreviewLoading ? 'opacity-50' : 'opacity-100'}`} 
            />
          ) : (
             <div className="text-center text-slate-500 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">Xem trước trực tiếp sẽ xuất hiện ở đây sau khi bạn tải ảnh lên và chọn tùy chọn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationPanel;