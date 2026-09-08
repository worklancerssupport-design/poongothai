import { useState, useCallback, useEffect } from "react";
import { fetchFileFromGitHub, saveFileToGitHub } from "../lib/github";
import type { OwnerData } from "@/lib/fetchData";

const OWNER_PATH = "src/data/owner.json";

export function useOwner() {
  const [originalData, setOriginalData] = useState<OwnerData | null>(null);
  const [editData, setEditData] = useState<OwnerData | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOwner = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { content, sha: fileSha } = await fetchFileFromGitHub(OWNER_PATH);
      const parsed = JSON.parse(content) as OwnerData;

      setOriginalData(parsed);
      setEditData(structuredClone(parsed));
      setSha(fileSha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch owner data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwner();
  }, [fetchOwner]);

  const updateEditData = useCallback((updater: (prev: OwnerData) => OwnerData) => {
    setEditData((prev) => {
      if (!prev) return null;
      return updater(prev);
    });
  }, []);

  const saveOwner = useCallback(async () => {
    if (!editData || !sha) {
      throw new Error("No data to save");
    }

    setSaving(true);
    setError(null);

    try {
      const content = JSON.stringify(editData, null, 2);
      const { newSha } = await saveFileToGitHub(
        OWNER_PATH,
        content,
        sha,
        "Update owner data via edit panel"
      );

      setOriginalData(structuredClone(editData));
      setSha(newSha);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save owner data");
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
    fetchOwner,
    updateEditData,
    saveOwner,
    discardChanges,
  };
}
