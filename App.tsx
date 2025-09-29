import React, { useState } from 'react';
import { UploadedImage, GenerationOptions } from './types';
import { 
    STYLE_OPTIONS, 
    CONTEXT_OPTIONS, 
    CAMERA_ANGLE_OPTIONS, 
    LIGHTING_OPTIONS 
} from './constants';
import { generateImage, generatePreview, getAiSuggestions, getRandomTheme } from './services/geminiService';
import { useHistoryState } from './useHistoryState';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import OptionSelector from './components/OptionSelector';
import GenerationPanel from './components/GenerationPanel';
import ErrorMessage from './components/ErrorMessage';
import AiAssistant from './components/AiAssistant';

const initialOptions: GenerationOptions = {
  style: '',
  context: '',
  cameraAngle: '',
  lighting: '',
};

function App() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  
  const { 
    state: options, 
    set: setOptions, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistoryState<GenerationOptions>(initialOptions);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [isSurprising, setIsSurprising] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Vui lòng tải lên một hình ảnh.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage(uploadedImage, options);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi không mong muốn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!uploadedImage) {
      setError('Vui lòng tải lên một hình ảnh.');
      return;
    }
    if (!options.style && !options.context) {
      setError('Vui lòng chọn Phong cách hoặc Bối cảnh để xem trước.');
      return;
    }


    setIsPreviewLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generatePreview(uploadedImage, {
        style: options.style,
        context: options.context,
      });
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi không mong muốn khi tạo xem trước.');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleAiSuggest = async () => {
    if (!uploadedImage) {
      setError('Vui lòng tải lên một hình ảnh để nhận gợi ý.');
      return;
    }

    setIsSuggesting(true);
    setError(null);

    try {
      const suggestions = await getAiSuggestions(uploadedImage);
      setOptions(prev => ({
        ...prev,
        style: suggestions.style,
        context: suggestions.context,
      }));
    } catch (err: any) {
      setError(err.message || 'Lỗi khi nhận gợi ý từ AI.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleRandomTheme = async () => {
    setIsSurprising(true);
    setError(null);

    try {
      const theme = await getRandomTheme();
      setOptions(theme); // This replaces all options
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo chủ đề ngẫu nhiên.');
    } finally {
      setIsSurprising(false);
    }
  };
  
  const isReadyToGenerate = !!uploadedImage;
  const isReadyForPreview = !!uploadedImage && (!!options.style.trim() || !!options.context.trim());

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <ErrorMessage message={error} onDismiss={() => setError(null)} />
      <main className="container mx-auto px-4 py-8">
        <Header onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-8">
            <OptionSelector
              title="Thêm phong cách"
              options={STYLE_OPTIONS}
              selectedValue={options.style}
              onValueChange={value => setOptions(prev => ({ ...prev, style: value }))}
              customPlaceholder="VD: Hoạt hình 3D, siêu thực..."
            />
            <OptionSelector
              title="Xác định bối cảnh"
              options={CONTEXT_OPTIONS}
              selectedValue={options.context}
              onValueChange={value => setOptions(prev => ({ ...prev, context: value }))}
              customPlaceholder="VD: Bên trong buồng lái tàu vũ trụ..."
            />
            <OptionSelector
              title="Đặt góc máy"
              options={CAMERA_ANGLE_OPTIONS}
              selectedValue={options.cameraAngle}
              onValueChange={value => setOptions(prev => ({ ...prev, cameraAngle: value }))}
              customPlaceholder="VD: Chụp từ dưới lên..."
            />
            <OptionSelector
              title="Chọn ánh sáng"
              options={LIGHTING_OPTIONS}
              selectedValue={options.lighting}
              onValueChange={value => setOptions(prev => ({ ...prev, lighting: value }))}
              customPlaceholder="VD: Ánh nến lung linh..."
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:sticky lg:top-8 self-start">
            <ImageUploader onImageUpload={setUploadedImage} uploadedImage={uploadedImage} />
            <AiAssistant 
              onSuggest={handleAiSuggest}
              onSurprise={handleRandomTheme}
              isSuggesting={isSuggesting}
              isSurprising={isSurprising}
              isReady={!!uploadedImage}
            />
            <GenerationPanel 
              onGenerate={handleGenerate}
              onPreview={handlePreview}
              isLoading={isLoading}
              isPreviewLoading={isPreviewLoading}
              generatedImage={generatedImage}
              isReady={isReadyToGenerate}
              isReadyForPreview={isReadyForPreview}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;