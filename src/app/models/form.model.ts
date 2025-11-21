export interface ImageInfo {
  key: string;
  url: string;
}

export type UploadFolder = 'advice' | 'avatar' | 'therapy';

export interface EditableItem {
  [key: string]: unknown;
}

export interface UploadResponse {
  uploadUrl: string;
  viewUrl: string;
  key: string;
}
