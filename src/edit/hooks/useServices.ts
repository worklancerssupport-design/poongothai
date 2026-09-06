import { useState, useCallback, useEffect } from "react";
import { fetchFileFromGitHub, saveFileToGitHub } from "../lib/github";
import type { ServiceCategory } from "@/lib/fetchData";

const SERVICES_PATH = "src/data/services.json";

export function useServices() {
  const [originalData, setOriginalData] = useState<ServiceCategory[] | null>(null);
  const [editData, setEditData] = useState<ServiceCategory[] | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { content, sha: fileSha } = await fetchFileFromGitHub(SERVICES_PATH);
      const parsed = JSON.parse(content) as ServiceCategory[];

      setOriginalData(parsed);
      setEditData(structuredClone(parsed));
      setSha(fileSha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateEditData = useCallback((updater: (prev: ServiceCategory[]) => ServiceCategory[]) => {
    setEditData((prev) => {
      if (!prev) return null;
      return updater(prev);
    });
  }, []);

  const saveServices = useCallback(async () => {
    if (!editData || !sha) {
      throw new Error("No data to save");
    }

    setSaving(true);
    setError(null);

    try {
      const content = JSON.stringify(editData, null, 2);
      const { newSha } = await saveFileToGitHub(
        SERVICES_PATH,
        content,
        sha,
        "Update services data via edit panel"
      );

      setOriginalData(structuredClone(editData));
      setSha(newSha);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save services");
      return false;
    } finally {
      setSaving(false);
    }
  }, [editData, sha]);

  const discardChanges = useCallback(() => {
    if (originalData) {
      setEditData(structuredClone(originalData));
    }
  }, [originalData]);

  const hasChanges = originalData !== null && editData !== null &&
    JSON.stringify(originalData) !== JSON.stringify(editData);

  return {
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
  };
}
