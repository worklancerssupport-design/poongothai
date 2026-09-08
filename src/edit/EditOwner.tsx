import type React from "react";
import { useOwner } from "./hooks/useOwner";
import type { OwnerData, ShopImage } from "@/lib/fetchData";

interface EditOwnerProps {
  children: (props: {
    originalData: OwnerData | null;
    editData: OwnerData | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasChanges: boolean;
    refresh: () => void;
    updateOwner: (updates: Partial<OwnerData>) => void;
    updateShopImage: (index: number, updates: Partial<ShopImage>) => void;
    addShopImage: (image: ShopImage) => void;
    removeShopImage: (index: number) => void;
    save: () => Promise<boolean>;
    discard: () => void;
  }) => React.ReactNode;
}

export default function EditOwner({ children }: EditOwnerProps) {
  const {
    originalData,
    editData,
    loading,
    saving,
    error,
    hasChanges,
    fetchOwner,
    updateEditData,
    saveOwner,
    discardChanges,
  } = useOwner();

  const updateOwner = (updates: Partial<OwnerData>) => {
    updateEditData((prev) => ({ ...prev, ...updates }));
  };

  const updateShopImage = (index: number, updates: Partial<ShopImage>) => {
    updateEditData((prev) => {
      const images = [...(prev.shopImages || [])];
      images[index] = { ...images[index], ...updates };
      return { ...prev, shopImages: images };
    });
  };

  const addShopImage = (image: ShopImage) => {
    updateEditData((prev) => ({
      ...prev,
      shopImages: [...(prev.shopImages || []), image],
    }));
  };

  const removeShopImage = (index: number) => {
    updateEditData((prev) => ({
      ...prev,
      shopImages: (prev.shopImages || []).filter((_, i) => i !== index),
    }));
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
        refresh: fetchOwner,
        updateOwner,
        updateShopImage,
        addShopImage,
        removeShopImage,
        save: saveOwner,
        discard: discardChanges,
      })}
    </>
  );
}
