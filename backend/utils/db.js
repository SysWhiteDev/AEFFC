import "dotenv/config";
import { Redis } from "ioredis";

const db = new Redis();

async function initializeDatabase() {
  const hashes = ["pixelgrid", "settings"];
  for (const hash of hashes) {
    const exists = await db.hexists(hash, "maintenance");
    if (!exists && hash === "settings") {
      await db.hset(hash, "maintenance", false);
      await db.hset(hash, "maintenancetext", "NULL");
      await db.hset(hash, "canvaswidth", 2000);
      await db.hset(hash, "canvasheight", 1500);
      await db.hset(hash, "pixelsize", 10);
    }
  }
  console.log("[REDIS] Initialized database");
}

initializeDatabase().catch(console.error);

export default db;
