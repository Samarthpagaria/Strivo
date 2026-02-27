// ⚠️ In ESM, static `import` statements are HOISTED before any code runs.
// So dotenv.config() placed between imports runs TOO LATE.
// We must use a top-level async IIFE with dynamic imports to ensure
// .env is loaded BEFORE any other module (mongoose, app, etc.) is imported.

import dns from "dns";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// 🔧 FIX: Force Node.js to use Google's public DNS (8.8.8.8)
// Root cause: Reliance router provides DNS via IPv6 (2405:201:...)
// but Node.js c-ares library can't resolve MongoDB SRV records over IPv6 DNS.
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env FIRST — before any other module gets imported
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Now dynamically import modules AFTER env vars are set
const { default: connectDB } = await import("./db/index.js");
const { app } = await import("./app.js");

// Connect to DB and start server
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Errrr: " + error);
      throw error;
    });

    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`✅ Server is running on port: ${process.env.PORT || 8000}`);
    });

    server.on("close", () => {
      console.log("The server is shutting down.");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed !! ", error);
  });
