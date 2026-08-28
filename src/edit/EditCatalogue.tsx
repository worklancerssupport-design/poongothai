import { useCatalogue } from "./hooks/useCatalogue";
import type { CatalogueData, CatalogueItem } from "./types";

interface EditCatalogueProps {
  children: (props: {
    originalData: CatalogueData | null;
    editData: CatalogueData | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasChanges: boolean;
    refresh: () => void;
    updateItem: (index: number, updates: Partial<CatalogueItem>) => void;
    addItem: (item: CatalogueItem) => void;
    removeItem: (index: number) => void;
    save: () => Promise<boolean>;
    discard: () => void;
  }) => React.ReactNode;
}

export default function EditCatalogue({ children }: EditCatalogueProps) {
  const {
    originalData,
    editData,
    loading,
    saving,
    error,
    hasChanges,
    fetchCatalogue,
    updateEditData,
    saveCatalogue,
    discardChanges,
  } = useCatalogue();

  const updateItem = (index: number, updates: Partial<CatalogueItem>) => {
    updateEditData((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const addItem = (item: CatalogueItem) => {
    updateEditData((prev) => [...prev, item]);
  };

  const removeItem = (index: number) => {
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
        refresh: fetchCatalogue,
        updateItem,
        addItem,
        removeItem,
        save: saveCatalogue,
        discard: discardChanges,
      })}
    </>
  );
}
