import { useState, useCallback, useEffect } from "react";
import { fetchFileFromGitHub, saveFileToGitHub } from "../lib/github";
import type { ContactData } from "@/lib/fetchData";

const CONTACT_PATH = "src/data/contact.json";

export function useContact() {
  const [originalData, setOriginalData] = useState<ContactData | null>(null);
  const [editData, setEditData] = useState<ContactData | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { content, sha: fileSha } = await fetchFileFromGitHub(CONTACT_PATH);
      const parsed = JSON.parse(content) as ContactData;
      setOriginalData(parsed);
      setEditData(structuredClone(parsed));
      setSha(fileSha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contact data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  const updateEditData = useCallback((updater: (prev: ContactData) => ContactData) => {
    setEditData((prev) => (prev ? updater(prev) : null));
  }, []);

  const saveContact = useCallback(async () => {
    if (!editData || !sha) throw new Error("No data to save");
    setSaving(true);
    setError(null);
    try {
      const content = JSON.stringify(editData, null, 2);
      const { newSha } = await saveFileToGitHub(CONTACT_PATH, content, sha, "Update contact data via edit panel");
      setOriginalData(structuredClone(editData));
      setSha(newSha);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contact data");
      return false;
    } finally {
      setSaving(false);
    }
  }, [editData, sha]);

  const discardChanges = useCallback(() => {
    if (originalData) setEditData(structuredClone(originalData));
  }, [originalData]);

  const hasChanges =
    originalData !== null && editData !== null && JSON.stringify(originalData) !== JSON.stringify(editData);

  return {
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
  };
}
