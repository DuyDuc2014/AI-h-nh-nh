import { GoogleGenAI, Modality } from "@google/genai";
import { UploadedImage, GenerationOptions } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function constructPrompt(options: Omit<GenerationOptions, 'aspectRatio'>): string {
    return `Re-imagine the person in the provided photo with the following creative direction. IMPORTANT: Faithfully preserve the person's distinct facial features, identity, and all their characteristics.
- Style: ${options.style || 'photorealistic'}.
- Scene/Context: ${options.context || 'a simple, elegant background'}.
- Camera Angle: ${options.cameraAngle || 'eye-level portrait shot'}.
- Lighting: ${options.lighting || 'soft, flattering studio light'}.
The final image should be a high-quality, artistic interpretation based on these elements.`;
}

export const generateImage = async (
    image: UploadedImage,
    options: Omit<GenerationOptions, 'aspectRatio'>
): Promise<string> => {
    try {
        const prompt = constructPrompt(options);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
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

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }

        throw new Error("No image was generated. The model may have refused the request.");
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
};

function constructPreviewPrompt(style: string, context: string): string {
    return `Generate a quick, conceptual preview of the person in the provided photo. IMPORTANT: Faithfully preserve the person's distinct facial features and identity.
- Style: ${style || 'photorealistic'}.
- Scene/Context: ${context || 'a simple background'}.
Focus on the face and how the style is applied. This is a fast preview, not a final, detailed image.`;
}

export const generatePreview = async (
    image: UploadedImage,
    options: { style: string; context: string }
): Promise<string> => {
    try {
        const prompt = constructPreviewPrompt(options.style, options.context);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
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

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }

        throw new Error("No preview image was generated. The model may have refused the request.");
    } catch (error) {
        console.error("Error generating preview with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate preview: ${error.message}`);
        }
        throw new Error("An unknown error occurred during preview generation.");
    }
};
