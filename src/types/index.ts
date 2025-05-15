export interface ConversionSettings {
  width: number;
  height: number;
  scale: number;
  maintainAspectRatio: boolean;
  originalAspectRatio?: number;
}

export type PresetSize = 'small' | 'medium' | 'large' | 'xlarge' | 'custom';

export interface SvgData {
  content: string;
  filename: string;
  originalWidth?: number;
  originalHeight?: number;
  previewWidth?: number;
  previewHeight?: number;
}