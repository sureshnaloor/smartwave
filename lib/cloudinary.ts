import { Cloudinary } from '@cloudinary/url-gen';

// Maximum file size (100MB)
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Target file size after optimization (10MB)
export const TARGET_FILE_SIZE = 10 * 1024 * 1024;

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export interface CloudinaryOptions {
  quality?: string;
  fetch_format?: string;
  resource_type?: string;
  transformation?: Array<{
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    fetch_format?: string;
  }>;
}

// Create a Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<CloudinaryResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}