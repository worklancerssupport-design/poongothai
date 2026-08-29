import type { VercelRequest, VercelResponse } from "@vercel/node";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
};

function decodeBase64Utf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

function encodeBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function handleGet(filePath: string, res: VercelResponse) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}&t=${Date.now()}`;

  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    return res.status(response.status).json({ error: response.statusText });
  }

  const data = await response.json();
  const content = decodeBase64Utf8(data.content);

  res.status(200).json({ content, sha: data.sha });
}

async function handlePut(body: { path: string; content: string; sha: string; message: string }, res: VercelResponse) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${body.path}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      message: body.message,
      content: encodeBase64Utf8(body.content),
      sha: body.sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: response.statusText });
  }

  const data = await response.json();
  res.status(200).json({ newSha: data.content.sha });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const filePath = req.query.path as string;
      if (!filePath) return res.status(400).json({ error: "Missing path query param" });
      return await handleGet(filePath, res);
    }

    if (req.method === "PUT") {
      return await handlePut(req.body, res);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
