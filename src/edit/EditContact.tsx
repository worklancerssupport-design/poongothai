import type React from "react";
import { useContact } from "./hooks/useContact";
import type { ContactData } from "@/lib/fetchData";

interface EditContactProps {
  children: (props: {
    originalData: ContactData | null;
    editData: ContactData | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasChanges: boolean;
    refresh: () => void;
    updateContact: (updates: Partial<ContactData>) => void;
    save: () => Promise<boolean>;
    discard: () => void;
  }) => React.ReactNode;
}

export default function EditContact({ children }: EditContactProps) {
  const {
    originalData,
    editData,
    loading,
    saving,
    error,
    hasChanges,
    fetchContact,
    updateEditData,
    saveContact,
    discardChanges,
  } = useContact();

  const updateContact = (updates: Partial<ContactData>) => {
    updateEditData((prev) => ({ ...prev, ...updates }));
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
        refresh: fetchContact,
        updateContact,
        save: saveContact,
        discard: discardChanges,
      })}
    </>
  );
}
