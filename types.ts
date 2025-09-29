export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export interface GenerationOptions {
  style: string;
  context: string;
  cameraAngle: string;
  lighting: string;
}

// FIX: Added AspectRatio type for AspectRatioSelector component.
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
