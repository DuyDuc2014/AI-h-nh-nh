// FIX: Import AspectRatio type for ASPECT_RATIO_OPTIONS.
import type { AspectRatio } from './types';

export const STYLE_OPTIONS: string[] = [
  "Tranh kỹ thuật số, giả tưởng",
  "Thành phố cyberpunk đèn neon",
  "Chiến binh cổ đại, áo giáp chi tiết",
  "Phi hành gia trong không gian, nền vũ trụ",
  "Chân dung phong cách ấn tượng",
  "Minh họa màu nước rực rỡ",
  "Gothic và bí ẩn",
  "Nhà phát minh Steampunk",
  "Siêu anh hùng, ánh sáng điện ảnh",
  "Phong cách nhân vật Anime",
  "Kiệt tác sơn dầu",
  "Nhân vật hoạt hình Pixar",
];

export const CONTEXT_OPTIONS: string[] = [
  "Rừng sương mù",
  "Cảnh quan thành phố tương lai",
  "Lâu đài bị phù phép",
  "Bãi biển ngập nắng",
  "Tàn tích hậu tận thế",
  "Thư viện ấm cúng",
  "Cảnh quan hành tinh xa lạ",
  "Họa tiết hình học trừu tượng",
];

export const CAMERA_ANGLE_OPTIONS: string[] = [
  "Cận cảnh",
  "Toàn thân",
  "Góc nhìn từ dưới lên",
  "Góc nhìn từ trên xuống",
  "Góc nghiêng",
  "Cảnh rộng",
  "Nhìn nghiêng",
  "Góc máy qua vai",
];

export const LIGHTING_OPTIONS: string[] = [
  "Ánh sáng điện ảnh",
  "Ánh sáng dịu, khuếch tán",
  "Đèn ngược sáng ấn tượng",
  "Ánh nắng giờ vàng",
  "Ánh sáng neon",
  "Ánh sáng studio",
  "Ánh trăng kỳ bí",
  "Ánh sáng khói",
];

// FIX: Added ASPECT_RATIO_OPTIONS for AspectRatioSelector component.
export const ASPECT_RATIO_OPTIONS: { label: string; value: AspectRatio }[] = [
    { label: "Vuông (1:1)", value: "1:1" },
    { label: "Dọc (3:4)", value: "3:4" },
    { label: "Dọc (9:16)", value: "9:16" },
    { label: "Ngang (4:3)", value: "4:3" },
    { label: "Ngang (16:9)", value: "16:9" },
];
