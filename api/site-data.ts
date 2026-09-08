import type { VercelRequest, VercelResponse } from "@vercel/node";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

function apiUrl(path: string): string {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}&t=${Date.now()}`;
}

function decodeBase64Utf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

async function fetchJson(path: string) {
  const res = await fetch(apiUrl(path), { headers: HEADERS });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  const data = await res.json();
  return JSON.parse(decodeBase64Utf8(data.content));
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [services, packages, hairstyles, testimonials, contact, owner] =
      await Promise.all([
        fetchJson("src/data/services.json"),
        fetchJson("src/data/packages.json"),
        fetchJson("src/data/hairstyles.json"),
        fetchJson("src/data/testimonials.json"),
        fetchJson("src/data/contact.json"),
        fetchJson("src/data/owner.json"),
      ]);

    const bridalIdMap: Record<string, string> = {
      "women-straightening": "hair-styling",
      "women-makeup": "makeup",
      "women-massage": "body-care",
      "women-other": "beauty",
      "women-bleach": "bleach",
      "women-detan": "detan",
      "women-cleanup": "cleanup",
      "women-threading": "threading",
      "women-waxing": "waxing",
    };

    const bridalCategories = services
      .filter((cat: any) => cat.gender === "women" && cat.bridal)
      .map((cat: any) => ({
        id: bridalIdMap[cat.id] ?? cat.id,
        title: cat.title,
        icon: "",
        services: (cat.services || []).map((s: any) => ({
          name: s.name,
          price: s.bridalPrice ?? `₹${Number(s.price).toLocaleString("en-IN")}`,
        })),
        subCategories: cat.subCategories?.map((sub: any) => ({
          title: sub.title,
          rows: (sub.rows || []).map((r: any) => ({
            label: r.label,
            price: r.price,
            price2: r.price2,
            type: r.type,
          })),
        })),
      }));

    res.status(200).json({
      services,
      packages,
      mens: hairstyles.mens,
      womens: hairstyles.womens,
      kids: hairstyles.kids,
      bridalCategories,
      testimonials,
      contact,
      owner,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
