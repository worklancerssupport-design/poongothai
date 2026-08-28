import { useState, useCallback, useEffect } from "react";
import type { CatalogueData } from "../types";
import { fetchFileFromGitHub, saveFileToGitHub } from "../lib/github";

const CATALOGUE_PATH = "src/data/catalogue.json";

export function useCatalogue() {
  const [originalData, setOriginalData] = useState<CatalogueData | null>(null);
  const [editData, setEditData] = useState<CatalogueData | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogue = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { content, sha: fileSha } = await fetchFileFromGitHub(CATALOGUE_PATH);
      const parsed = JSON.parse(content) as CatalogueData;
      
      setOriginalData(parsed);
      setEditData(structuredClone(parsed));
      setSha(fileSha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch catalogue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogue();
  }, [fetchCatalogue]);

  const updateEditData = useCallback((updater: (prev: CatalogueData) => CatalogueData) => {
    setEditData((prev) => {
      if (!prev) return null;
      return updater(prev);
    });
  }, []);

  const saveCatalogue = useCallback(async () => {
    if (!editData || !sha) {
      throw new Error("No data to save");
    }

    setSaving(true);
    setError(null);

    try {
      const content = JSON.stringify(editData, null, 4);
      const { newSha } = await saveFileToGitHub(
        CATALOGUE_PATH,
        content,
        sha,
        "Update catalogue data via edit panel"
      );

      setOriginalData(structuredClone(editData));
      setSha(newSha);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save catalogue");
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
    fetchCatalogue,
    updateEditData,
    saveCatalogue,
    discardChanges,
  };
}
