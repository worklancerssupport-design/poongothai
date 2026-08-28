import { useHairstyles } from "./hooks/useHairstyles";
import { compressAndUpload, captureFromCamera, selectFromFile } from "./lib/cloudinary";
import type { HairstylesData, Hairstyle } from "./types";

type Gender = "mens" | "womens";

interface EditHairstylesProps {
  children: (props: {
    originalData: HairstylesData | null;
    editData: HairstylesData | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasChanges: boolean;
    refresh: () => void;
    updateItem: (gender: Gender, index: number, updates: Partial<Hairstyle>) => void;
    addItem: (gender: Gender, item: Hairstyle) => void;
    removeItem: (gender: Gender, index: number) => void;
    save: () => Promise<boolean>;
    discard: () => void;
    uploadImageFromDevice: (gender: Gender, index: number) => Promise<void>;
    uploadImageFromCamera: (gender: Gender, index: number) => Promise<void>;
    setImageUrl: (gender: Gender, index: number, url: string) => void;
    uploadingImage: boolean;
  }) => React.ReactNode;
}

export default function EditHairstyles({ children }: EditHairstylesProps) {
  const {
    originalData,
    editData,
    loading,
    saving,
    error,
    hasChanges,
    fetchHairstyles,
    updateEditData,
    saveHairstyles,
    discardChanges,
  } = useHairstyles();

  const [uploadingImage, setUploadingImage] = React.useState(false);

  const updateItem = (gender: Gender, index: number, updates: Partial<Hairstyle>) => {
    updateEditData((prev) => {
      const next = { ...prev };
      next[gender] = [...next[gender]];
      next[gender][index] = { ...next[gender][index], ...updates };
      return next;
    });
  };

  const addItem = (gender: Gender, item: Hairstyle) => {
    updateEditData((prev) => ({
      ...prev,
      [gender]: [...prev[gender], item],
    }));
  };

  const removeItem = (gender: Gender, index: number) => {
    updateEditData((prev) => ({
      ...prev,
      [gender]: prev[gender].filter((_, i) => i !== index),
    }));
  };

  const setImageUrl = (gender: Gender, index: number, url: string) => {
    updateItem(gender, index, { image: url });
  };

  const uploadImageFromDevice = async (gender: Gender, index: number) => {
    try {
      setUploadingImage(true);
      const file = await selectFromFile();
      const result = await compressAndUpload(file, 800, 0.7);
      updateItem(gender, index, { image: result.url });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadImageFromCamera = async (gender: Gender, index: number) => {
    try {
      setUploadingImage(true);
      const file = await captureFromCamera();
      const result = await compressAndUpload(file, 800, 0.7);
      updateItem(gender, index, { image: result.url });
    } catch (err) {
      console.error("Camera capture failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      {children({
        originalData,
        editData,
        loading,
        saving,
        error,
        hasChanges,
        refresh: fetchHairstyles,
        updateItem,
        addItem,
        removeItem,
        save: saveHairstyles,
        discard: discardChanges,
        uploadImageFromDevice,
        uploadImageFromCamera,
        setImageUrl,
        uploadingImage,
      })}
    </>
  );
}

import React from "react";
