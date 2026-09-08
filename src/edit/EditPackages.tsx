import type React from "react";
import { usePackages } from "./hooks/usePackages";
import type { Package } from "@/lib/fetchData";

interface EditPackagesProps {
  children: (props: {
    originalData: Package[] | null;
    editData: Package[] | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasChanges: boolean;
    refresh: () => void;
    updatePackage: (index: number, updates: Partial<Package>) => void;
    addPackage: (pkg: Package) => void;
    removePackage: (index: number) => void;
    save: () => Promise<boolean>;
    discard: () => void;
  }) => React.ReactNode;
}

export default function EditPackages({ children }: EditPackagesProps) {
  const {
    originalData,
    editData,
    loading,
    saving,
    error,
    hasChanges,
    fetchPackages,
    updateEditData,
    savePackages,
    discardChanges,
  } = usePackages();

  const updatePackage = (index: number, updates: Partial<Package>) => {
    updateEditData((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const addPackage = (pkg: Package) => {
    updateEditData((prev) => [...prev, pkg]);
  };

  const removePackage = (index: number) => {
    updateEditData((prev) => prev.filter((_, i) => i !== index));
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
        refresh: fetchPackages,
        updatePackage,
        addPackage,
        removePackage,
        save: savePackages,
        discard: discardChanges,
      })}
    </>
  );
}
