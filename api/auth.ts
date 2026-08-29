import type { VercelRequest, VercelResponse } from "@vercel/node";

const USERNAME = process.env.EDIT_USERNAME;
const PASSWORD = process.env.EDIT_PASSWORD;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Missing credentials" });
    }

    if (username === USERNAME && password === PASSWORD) {
      return res.status(200).json({ success: true });
    }

    return res.status(401).json({ success: false, error: "Invalid username or password" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}
