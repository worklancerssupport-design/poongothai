import type React from "react";
import { useServices } from "./hooks/useServices";
import type { ServiceCategory, ServiceItem } from "@/lib/fetchData";

interface EditServicesProps {
  children: (props: {
    originalData: ServiceCategory[] | null;
    editData: ServiceCategory[] | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasChanges: boolean;
    refresh: () => void;
    updateCategory: (catIndex: number, updates: Partial<ServiceCategory>) => void;
    addCategory: (category: ServiceCategory) => void;
    removeCategory: (catIndex: number) => void;
    updateService: (catIndex: number, svcIndex: number, updates: Partial<ServiceItem>) => void;
    addService: (catIndex: number, service: ServiceItem) => void;
    removeService: (catIndex: number, svcIndex: number) => void;
    updateSubRow: (catIndex: number, subIndex: number, rowIndex: number, updates: Partial<{ label: string; price: string; price2: string; type: string }>) => void;
    addSubRow: (catIndex: number, subIndex: number, row: { label: string; price: string; price2?: string; type?: string }) => void;
    removeSubRow: (catIndex: number, subIndex: number, rowIndex: number) => void;
    addSubCategory: (catIndex: number, subCategory: { title: string; rows: { label: string; price: string; price2?: string; type?: string }[] }) => void;
    removeSubCategory: (catIndex: number, subIndex: number) => void;
    save: () => Promise<boolean>;
    discard: () => void;
  }) => React.ReactNode;
}

export default function EditServices({ children }: EditServicesProps) {
  const {
    originalData,
    editData,
    loading,
    saving,
    error,
    hasChanges,
    fetchServices,
    updateEditData,
    saveServices,
    discardChanges,
  } = useServices();

  const updateCategory = (catIndex: number, updates: Partial<ServiceCategory>) => {
    updateEditData((prev) => {
      const next = [...prev];
      next[catIndex] = { ...next[catIndex], ...updates };
      return next;
    });
  };

  const addCategory = (category: ServiceCategory) => {
    updateEditData((prev) => [...prev, category]);
  };

  const removeCategory = (catIndex: number) => {
    updateEditData((prev) => prev.filter((_, i) => i !== catIndex));
  };

  const updateService = (catIndex: number, svcIndex: number, updates: Partial<ServiceItem>) => {
    updateEditData((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      const services = [...cat.services];
      services[svcIndex] = { ...services[svcIndex], ...updates };
      cat.services = services;
      next[catIndex] = cat;
      return next;
    });
  };

  const addService = (catIndex: number, service: ServiceItem) => {
    updateEditData((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      cat.services = [...cat.services, service];
      next[catIndex] = cat;
      return next;
    });
  };

  const removeService = (catIndex: number, svcIndex: number) => {
    updateEditData((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      cat.services = cat.services.filter((_, i) => i !== svcIndex);
      next[catIndex] = cat;
      return next;
    });
  };

  const updateSubRow = (catIndex: number, subIndex: number, rowIndex: number, updates: Partial<{ label: string; price: string; price2: string; type: string }>) => {
    updateEditData((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      const subs = [...(cat.subCategories || [])];
      const sub = { ...subs[subIndex] };
      const rows = [...sub.rows];
      rows[rowIndex] = { ...rows[rowIndex], ...updates };
      sub.rows = rows;
      subs[subIndex] = sub;
      cat.subCategories = subs;
      next[catIndex] = cat;
      return next;
    });
  };

  const addSubRow = (catIndex: number, subIndex: number, row: { label: string; price: string; price2?: string; type?: string }) => {
    updateEditData((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      const subs = [...(cat.subCategories || [])];
      const sub = { ...subs[subIndex] };
      sub.rows = [...sub.rows, row];
      subs[subIndex] = sub;
      cat.subCategories = subs;
      next[catIndex] = cat;
      return next;
    });
  };

  const removeSubRow = (catIndex: number, subIndex: number, rowIndex: number) => {
    updateEditData((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      const subs = [...(cat.subCategories || [])];
      const sub = { ...subs[subIndex] };
      sub.rows = sub.rows.filter((_, i) => i !== rowIndex);
      subs[subIndex] = sub;
      cat.subCategories = subs;
      next[catIndex] = cat;
      return next;
    });
  };

  const addSubCategory = (catIndex: number, subCategory: { title: string; rows: { label: string; price: string; price2?: string; type?: string }[] }) => {
    updateEditData((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      cat.subCategories = [...(cat.subCategories || []), subCategory];
      next[catIndex] = cat;
      return next;
    });
  };

  const removeSubCategory = (catIndex: number, subIndex: number) => {
    updateEditData((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      cat.subCategories = (cat.subCategories || []).filter((_, i) => i !== subIndex);
      next[catIndex] = cat;
      return next;
    });
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
        refresh: fetchServices,
        updateCategory,
        addCategory,
        removeCategory,
        updateService,
        addService,
        removeService,
        updateSubRow,
        addSubRow,
        removeSubRow,
        addSubCategory,
        removeSubCategory,
        save: saveServices,
        discard: discardChanges,
      })}
    </>
  );
}
