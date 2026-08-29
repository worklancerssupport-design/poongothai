import { useState, useCallback, useEffect } from "react";
import type { HairstylesData } from "../types";
import { fetchFileFromGitHub, saveFileToGitHub } from "../lib/github";

const HAIRSTYLES_PATH = "src/data/hairstyles.json";

interface HairstylesJson {
  mensHairstyles: HairstylesData["mens"];
  womensHairstyles: HairstylesData["womens"];
}

function parseHairstylesJson(content: string): HairstylesData {
  const parsed = JSON.parse(content) as HairstylesJson;
  return {
    mens: parsed.mensHairstyles,
    womens: parsed.womensHairstyles,
  };
}

function serializeHairstylesJson(data: HairstylesData): string {
  const json: HairstylesJson = {
    mensHairstyles: data.mens,
    womensHairstyles: data.womens,
  };
  return JSON.stringify(json, null, 2);
}

export function useHairstyles() {
  const [originalData, setOriginalData] = useState<HairstylesData | null>(null);
  const [editData, setEditData] = useState<HairstylesData | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHairstyles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { content, sha: fileSha } = await fetchFileFromGitHub(HAIRSTYLES_PATH);
      const parsed = parseHairstylesJson(content);

      setOriginalData(parsed);
      setEditData(structuredClone(parsed));
      setSha(fileSha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch hairstyles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHairstyles();
  }, [fetchHairstyles]);

  const updateEditData = useCallback(
    (updater: (prev: HairstylesData) => HairstylesData) => {
      setEditData((prev) => {
        if (!prev) return null;
        return updater(prev);
      });
    },
    []
  );

  const saveHairstyles = useCallback(async () => {
    if (!editData || !sha) {
      throw new Error("No data to save");
    }

    setSaving(true);
    setError(null);

    try {
      const content = serializeHairstylesJson(editData);
      const { newSha } = await saveFileToGitHub(
        HAIRSTYLES_PATH,
        content,
        sha,
        "Update hairstyles data via edit panel"
      );

      setOriginalData(structuredClone(editData));
      setSha(newSha);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save hairstyles");
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
    fetchHairstyles,
    updateEditData,
    saveHairstyles,
    discardChanges,
  };
}
