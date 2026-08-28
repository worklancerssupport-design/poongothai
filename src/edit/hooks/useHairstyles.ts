import { useState, useCallback, useEffect } from "react";
import type { HairstylesData, Hairstyle } from "../types";
import { fetchFileFromGitHub, saveFileToGitHub } from "../lib/github";

const HAIRSTYLES_PATH = "src/data/hairstyles.ts";

function parseHairstylesFile(content: string): HairstylesData {
  const mensMatch = content.match(
    /export\s+const\s+mensHairstyles\s*:\s*Hairstyle\[\]\s*=\s*(\[[\s\S]*?\]);/
  );
  const womensMatch = content.match(
    /export\s+const\s+womensHairstyles\s*:\s*Hairstyle\[\]\s*=\s*(\[[\s\S]*?\]);/
  );

  if (!mensMatch || !womensMatch) {
    throw new Error("Failed to parse hairstyles.ts — unexpected format");
  }

  const cleanJson = (raw: string) =>
    raw
      .replace(/,\s*([\]}])/g, "$1")
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
      .replace(/'([^']*)'/g, '"$1"');

  const mens = JSON.parse(cleanJson(mensMatch[1])) as Hairstyle[];
  const womens = JSON.parse(cleanJson(womensMatch[1])) as Hairstyle[];

  // const stripRupee = (items: Hairstyle[]) =>
  //   items.map((item) => ({
  //     ...item,
  //     price: item.price?.replace(/^₹/, ""),
  //     oldPrice: item.oldPrice?.replace(/^₹/, ""),
  //   }));

  // return { mens: stripRupee(mens), womens: stripRupee(womens) };
  return { mens, womens };
}

function serializeHairstylesFile(data: HairstylesData): string {
  const formatItem = (item: Hairstyle, indent: number = 2): string => {
    const pad = "  ".repeat(indent);
    const inner = "  ".repeat(indent + 1);
    const lines: string[] = [];
    lines.push(`${pad}{`);
    lines.push(`${inner}id: "${item.id}",`);
    lines.push(`${inner}name: "${item.name}",`);
    lines.push(`${inner}description: "${item.description.replace(/"/g, '\\"')}",`);
    lines.push(`${inner}image: "${item.image}",`);
    lines.push(`${inner}gender: "${item.gender}",`);
    lines.push(`${inner}tags: [${item.tags.map((t) => `"${t}"`).join(", ")}],`);
    lines.push(`${inner}bestFor: "${item.bestFor}",`);
    lines.push(`${inner}maintenance: "${item.maintenance}",`);
    lines.push(`${inner}time: "${item.time}",`);
    if (item.price) lines.push(`${inner}price: "${item.price}",`);
    if (item.oldPrice) lines.push(`${inner}oldPrice: "${item.oldPrice}",`);
    if (item.suitableHair) lines.push(`${inner}suitableHair: "${item.suitableHair}",`);
    lines.push(`${pad}}`);
    return lines.join("\n");
  };

  const formatArray = (arr: Hairstyle[], varName: string, typeAnnotation: string): string => {
    const items = arr.map((item) => formatItem(item)).join(",\n");
    return `export const ${varName}: ${typeAnnotation} = [\n${items},\n];`;
  };

  const interfaceBlock = `export interface Hairstyle {
  id: string;
  name: string;
  description: string;
  image: string;
  gender: "men" | "women";
  tags: string[];
  bestFor: string;
  maintenance: "Low" | "Medium" | "High";
  time: string;
  price?: string;
  oldPrice?: string;
  suitableHair?: string;
}`;

  return [
    interfaceBlock,
    "",
    formatArray(data.mens, "mensHairstyles", "Hairstyle[]"),
    "",
    formatArray(data.womens, "womensHairstyles", "Hairstyle[]"),
    "",
  ].join("\n");
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
      const parsed = parseHairstylesFile(content);

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
      const content = serializeHairstylesFile(editData);
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
