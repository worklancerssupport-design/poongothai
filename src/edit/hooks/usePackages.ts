import { useState, useCallback, useEffect } from "react";
import { fetchFileFromGitHub, saveFileToGitHub } from "../lib/github";
import type { Package } from "@/lib/fetchData";

const PACKAGES_PATH = "src/data/packages.json";

export function usePackages() {
  const [originalData, setOriginalData] = useState<Package[] | null>(null);
  const [editData, setEditData] = useState<Package[] | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { content, sha: fileSha } = await fetchFileFromGitHub(PACKAGES_PATH);
      const parsed = JSON.parse(content) as Package[];

      setOriginalData(parsed);
      setEditData(structuredClone(parsed));
      setSha(fileSha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const updateEditData = useCallback((updater: (prev: Package[]) => Package[]) => {
    setEditData((prev) => {
      if (!prev) return null;
      return updater(prev);
    });
  }, []);

  const savePackages = useCallback(async () => {
    if (!editData || !sha) {
      throw new Error("No data to save");
    }

    setSaving(true);
    setError(null);

    try {
      const content = JSON.stringify(editData, null, 2);
      const { newSha } = await saveFileToGitHub(
        PACKAGES_PATH,
        content,
        sha,
        "Update packages data via edit panel"
      );

      setOriginalData(structuredClone(editData));
      setSha(newSha);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save packages");
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

  const hasChanges =
    originalData !== null &&
    editData !== null &&
    JSON.stringify(originalData) !== JSON.stringify(editData);

  return {
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
  };
}
