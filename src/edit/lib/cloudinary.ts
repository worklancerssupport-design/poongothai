const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(
  file: File | Blob,
  folder: string = "poongothai/hairstyles"
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}

export async function compressAndUpload(
  file: File | Blob,
  maxWidth: number = 800,
  quality: number = 0.7,
  folder: string = "poongothai/hairstyles"
): Promise<CloudinaryUploadResult> {
  const compressedBlob = await compressImage(file, maxWidth, quality);
  return uploadToCloudinary(compressedBlob, folder);
}

function compressImage(
  file: File | Blob,
  maxWidth: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

export function captureFromCamera(): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    let settled = false;

    input.onchange = () => {
      if (settled) return;
      settled = true;
      const file = input.files?.[0];
      if (file) {
        resolve(file);
      } else {
        reject(new Error("No file selected"));
      }
    };

    input.onerror = () => {
      if (settled) return;
      settled = true;
      reject(new Error("Camera access failed"));
    };

    window.addEventListener("focus", function onFocus() {
      setTimeout(() => {
        if (!settled) {
          settled = true;
          window.removeEventListener("focus", onFocus);
          reject(new Error("Camera cancelled"));
        }
      }, 300);
      window.removeEventListener("focus", onFocus);
    }, { once: true });

    input.click();
  });
}

export function selectFromFile(): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    let settled = false;

    input.onchange = () => {
      if (settled) return;
      settled = true;
      const file = input.files?.[0];
      if (file) {
        resolve(file);
      } else {
        reject(new Error("No file selected"));
      }
    };

    input.onerror = () => {
      if (settled) return;
      settled = true;
      reject(new Error("File selection failed"));
    };

    window.addEventListener("focus", function onFocus() {
      setTimeout(() => {
        if (!settled) {
          settled = true;
          window.removeEventListener("focus", onFocus);
          reject(new Error("File selection cancelled"));
        }
      }, 300);
      window.removeEventListener("focus", onFocus);
    }, { once: true });

    input.click();
  });
}

export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url) || 
           url.includes("cloudinary.com") ||
           url.includes("unsplash.com") ||
           url.includes("shopify.com") ||
           url.includes("pinimg.com") ||
           url.includes("googleusercontent.com");
  } catch {
    return false;
  }
}
