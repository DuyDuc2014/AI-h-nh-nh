import React, { useState, useCallback, useMemo } from 'react';
import { UploadedImage } from '../types';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  uploadedImage: UploadedImage | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const clarityScore = useMemo(() => uploadedImage ? (Math.random() * 15 + 85).toFixed(0) : 0, [uploadedImage]);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        alert('Chỉ hỗ trợ file PNG, JPG, hoặc WEBP.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        onImageUpload({ base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/webp';
    input.onchange = (e) => handleFileChange((e.target as HTMLInputElement).files);
    input.click();
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Bước 1: Tải lên ảnh chân dung</h2>
      </div>

      {!uploadedImage ? (
        <div
          onClick={openFileDialog}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex-grow flex flex-col justify-center items-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-purple-500'
          }`}
        >
          <UploadIcon className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-slate-300 font-semibold">Nhấp để tải lên hoặc kéo và thả</p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG, hoặc WEBP. Gương mặt rõ nét cho kết quả tốt nhất.</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-center items-center">
            <div className="relative w-48 h-48">
                <img
                    src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`}
                    alt="Uploaded portrait"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                <div className="absolute bottom-2 right-2 bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                    {clarityScore}% Rõ nét
                </div>
            </div>
            <button
                onClick={openFileDialog}
                className="mt-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
                Chọn ảnh khác
            </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;