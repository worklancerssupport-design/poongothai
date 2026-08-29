import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  function apiPlugin() {
    return {
      name: "api-dev-server",
      configureServer(server: any) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (!req.url?.startsWith("/api/")) return next();

          const GITHUB_TOKEN = env.GITHUB_TOKEN;
          const GITHUB_OWNER = env.GITHUB_OWNER;
          const GITHUB_REPO = env.GITHUB_REPO;
          const GITHUB_BRANCH = env.GITHUB_BRANCH || "main";

          const HEADERS: Record<string, string> = {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          };

          function apiUrl(filePath: string) {
            return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}&t=${Date.now()}`;
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

          async function fetchJson(filePath: string) {
            const r = await fetch(apiUrl(filePath), { headers: HEADERS });
            if (!r.ok) throw new Error(`Failed to fetch ${filePath}: ${r.statusText}`);
            const data = await r.json();
            return JSON.parse(decodeBase64Utf8(data.content));
          }

          res.setHeader("Content-Type", "application/json");

          try {
            if (req.url === "/api/site-data") {
              const [services, packages, hairstyles, bridalCategories, testimonials, contact, owner, catalogue] =
                await Promise.all([
                  fetchJson("src/data/services.json"),
                  fetchJson("src/data/packages.json"),
                  fetchJson("src/data/hairstyles.json"),
                  fetchJson("src/data/bridalServices.json"),
                  fetchJson("src/data/testimonials.json"),
                  fetchJson("src/data/contact.json"),
                  fetchJson("src/data/owner.json"),
                  fetchJson("src/data/catalogue.json"),
                ]);

              res.end(
                JSON.stringify({
                  services,
                  packages,
                  mensHairstyles: hairstyles.mensHairstyles,
                  womensHairstyles: hairstyles.womensHairstyles,
                  bridalCategories,
                  testimonials,
                  contact,
                  owner,
                  catalogue,
                })
              );
              return;
            }

            if (req.url?.startsWith("/api/github-file")) {
              const url = new URL(req.url, "http://localhost");

              if (req.method === "GET") {
                const filePath = url.searchParams.get("path");
                if (!filePath) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: "Missing path query param" }));
                  return;
                }

                const r = await fetch(apiUrl(filePath), { headers: HEADERS });
                if (!r.ok) {
                  res.statusCode = r.status;
                  res.end(JSON.stringify({ error: r.statusText }));
                  return;
                }

                const data = await r.json();
                const content = decodeBase64Utf8(data.content);
                res.end(JSON.stringify({ content, sha: data.sha }));
                return;
              }

              if (req.method === "PUT") {
                const body = await new Promise<any>((resolve, reject) => {
                  let data = "";
                  req.on("data", (chunk: any) => (data += chunk));
                  req.on("end", () => {
                    try {
                      resolve(JSON.parse(data));
                    } catch (e) {
                      reject(e);
                    }
                  });
                });

                const r = await fetch(apiUrl(body.path), {
                  method: "PUT",
                  headers: HEADERS,
                  body: JSON.stringify({
                    message: body.message,
                    content: encodeBase64Utf8(body.content),
                    sha: body.sha,
                    branch: GITHUB_BRANCH,
                  }),
                });

                if (!r.ok) {
                  res.statusCode = r.status;
                  res.end(JSON.stringify({ error: r.statusText }));
                  return;
                }

                const data = await r.json();
                res.end(JSON.stringify({ newSha: data.content.sha }));
                return;
              }

              res.statusCode = 405;
              res.end(JSON.stringify({ error: "Method not allowed" }));
              return;
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Not found" }));
          } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            res.statusCode = 500;
            res.end(JSON.stringify({ error: message }));
          }
        });
      },
    };
  }

  return {
    plugins: [react(), apiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
    },
  };
});
