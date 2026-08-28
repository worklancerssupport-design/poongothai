const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
const GITHUB_BRANCH = import.meta.env.VITE_GITHUB_BRANCH || "main";

const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
};

export async function fetchFileFromGitHub(filePath: string): Promise<{ content: string; sha: string }> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}&t=${Date.now()}`;
  
  const response = await fetch(url, { headers: HEADERS });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  
  const data = await response.json();
  const content = decodeBase64Utf8(data.content);
  
  return { content, sha: data.sha };
}

export async function saveFileToGitHub(
  filePath: string,
  content: string,
  sha: string,
  message: string
): Promise<{ newSha: string }> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  
  const response = await fetch(url, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      message,
      content: encodeBase64Utf8(content),
      sha,
      branch: GITHUB_BRANCH,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to save file: ${response.statusText}`);
  }
  
  const data = await response.json();
  return { newSha: data.content.sha };
}

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
