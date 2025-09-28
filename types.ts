export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface GenerationOptions {
  style: string;
  context: string;
  cameraAngle: string;
  lighting: string;
  aspectRatio: AspectRatio;
}
