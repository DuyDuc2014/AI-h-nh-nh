import { GoogleGenAI, Modality, Type } from "@google/genai";
import { UploadedImage, GenerationOptions } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function constructPrompt(options: GenerationOptions): string {
    return `Re-imagine the people in the provided photo according to the creative direction below. Preserve the core facial features and likeness of each person so they remain recognizable, while adapting them to the new style. Create a cohesive, high-quality image.
- Style: ${options.style || 'photorealistic'}.
- Scene/Context: ${options.context || 'a simple, elegant background'}.
- Camera Angle: ${options.cameraAngle || 'eye-level portrait shot'}.
- Lighting: ${options.lighting || 'soft, flattering studio light'}.`;
}

export const generateImage = async (
    image: UploadedImage,
    options: GenerationOptions
): Promise<string> => {
    try {
        const prompt = constructPrompt(options);

        const response = await ai.models.generateContent({
            // FIX: Updated model name to stable version per guidelines.
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: image.base64,
                            mimeType: image.mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const candidate = response.candidates?.[0];

        // Case 1: No valid candidate from the model
        if (!candidate) {
            const blockReason = response.promptFeedback?.blockReason;
            if (blockReason) {
                throw new Error(`Yêu cầu đã bị chặn vì lý do an toàn: ${blockReason}. Vui lòng thử một hình ảnh hoặc văn bản khác.`);
            }
            throw new Error("Mô hình AI không cung cấp phản hồi hợp lệ. Vui lòng thử lại.");
        }

        // Case 2: Candidate exists, check for image data
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }

        // Case 3: Candidate exists, but no image. Check for text explanation.
        const textExplanation = candidate.content.parts.find(p => p.text)?.text;
        if (textExplanation) {
             throw new Error(`Mô hình từ chối tạo ảnh. Lý do: ${textExplanation}`);
        }

        // Case 4: Candidate exists, but no image and no text explanation.
        throw new Error("Không có hình ảnh nào được tạo. Mô hình có thể đã từ chối yêu cầu của bạn.");
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        if (error instanceof Error) {
            throw error; // Re-throw the specific error message we constructed, or the one from the API call itself.
        }
        throw new Error("Đã xảy ra lỗi không xác định trong quá trình tạo ảnh.");
    }
};

function constructPreviewPrompt(style: string, context: string): string {
    return `Generate a quick preview of the people in the provided photo. Preserve their core facial features so they are recognizable.
- Style: ${style || 'photorealistic'}.
- Scene/Context: ${context || 'a simple background'}.
This is a fast preview focusing on how the style applies to the faces.`;
}

export const generatePreview = async (
    image: UploadedImage,
    options: { style: string; context: string }
): Promise<string> => {
    try {
        const prompt = constructPreviewPrompt(options.style, options.context);

        const response = await ai.models.generateContent({
            // FIX: Updated model name to stable version per guidelines.
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: image.base64,
                            mimeType: image.mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const candidate = response.candidates?.[0];

        // Case 1: No valid candidate
        if (!candidate) {
            const blockReason = response.promptFeedback?.blockReason;
            if (blockReason) {
                throw new Error(`Yêu cầu xem trước đã bị chặn vì lý do an toàn: ${blockReason}. Vui lòng thử một hình ảnh hoặc văn bản khác.`);
            }
            throw new Error("Mô hình AI không cung cấp phản hồi xem trước hợp lệ. Vui lòng thử lại.");
        }
        
        // Case 2: Found image
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        // Case 3: Found text explanation
        const textExplanation = candidate.content.parts.find(p => p.text)?.text;
        if (textExplanation) {
             throw new Error(`Mô hình từ chối tạo xem trước. Lý do: ${textExplanation}`);
        }

        // Case 4: No image, no text
        throw new Error("Không có ảnh xem trước nào được tạo. Mô hình có thể đã từ chối yêu cầu của bạn.");
    } catch (error) {
        console.error("Error generating preview with Gemini:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Đã xảy ra lỗi không xác định trong quá trình tạo xem trước.");
    }
};

export const getAiSuggestions = async (
    image: UploadedImage
): Promise<{ style: string; context: string; }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: image.base64, mimeType: image.mimeType } },
                    { text: "Phân tích hình ảnh được cung cấp. Dựa trên biểu cảm của người trong ảnh và bối cảnh (nếu có), hãy đề xuất một 'phong cách' (style) và một 'bối cảnh' (context) sáng tạo để tái tạo lại hình ảnh. Cung cấp câu trả lời dưới dạng đối tượng JSON với hai khóa: 'style' và 'context'. Các giá trị phải là chuỗi ngắn gọn, giàu trí tưởng tượng bằng tiếng Việt." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        style: { type: Type.STRING, description: "Phong cách nghệ thuật được đề xuất." },
                        context: { type: Type.STRING, description: "Bối cảnh hoặc khung cảnh được đề xuất." }
                    },
                    required: ['style', 'context']
                }
            }
        });
        const json = JSON.parse(response.text);
        return json;
    } catch (error) {
        console.error("Error getting AI suggestions:", error);
        throw new Error("Không thể nhận được gợi ý từ AI. Vui lòng thử lại.");
    }
};

export const getRandomTheme = async (): Promise<GenerationOptions> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Tạo một bộ tùy chọn ngẫu nhiên, sáng tạo và có chủ đề nhất quán cho một trình tạo chân dung AI. Chủ đề phải thú vị và hấp dẫn về mặt hình ảnh. Cung cấp câu trả lời dưới dạng đối tượng JSON có bốn khóa: 'style', 'context', 'cameraAngle' và 'lighting'. Các giá trị phải là chuỗi ngắn gọn, giàu trí tưởng tượng bằng tiếng Việt.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        style: { type: Type.STRING, description: "Phong cách nghệ thuật." },
                        context: { type: Type.STRING, description: "Bối cảnh hoặc khung cảnh." },
                        cameraAngle: { type: Type.STRING, description: "Góc máy ảnh." },
                        lighting: { type: Type.STRING, description: "Kiểu chiếu sáng." }
                    },
                    required: ['style', 'context', 'cameraAngle', 'lighting']
                }
            }
        });
        const json = JSON.parse(response.text);
        return json;
    } catch (error) {
        console.error("Error getting random theme:", error);
        throw new Error("Không thể tạo chủ đề ngẫu nhiên. Vui lòng thử lại.");
    }
};