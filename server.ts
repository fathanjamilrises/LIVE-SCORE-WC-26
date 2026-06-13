import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add a sample /api/matches endpoint that acts as a proxy to a real Football API (like api-sports)
  app.get("/api/matches", async (req, res) => {
    const apiKey = process.env.FOOTBALL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "FOOTBALL_API_KEY environment variable is missing. Please configure it in the secrets menu to use live API data." });
    }

    try {
      // Proxying to standard API-football v3 - grabbing current day fixtures as example,
      // since the 2026 World Cup hasn't started yet.
      // E.g., we fetch current matches if WC26 hasn't started, or specifically WC matches.
      const response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
        headers: {
          "x-apisports-key": apiKey,
        }
      });
      
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch data from provider" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
