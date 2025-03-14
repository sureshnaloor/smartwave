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
  folder: 'photos' | 'logos'
): Promise<CloudinaryResponse> {
  try {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 100MB limit');
    }

    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

    // Upload to Cloudinary with automatic optimization
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        folder,
        options: {
          quality: 'auto:good',
          fetch_format: 'auto',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        }
      }),
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await uploadResponse.json();
    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}