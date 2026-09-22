// Standalone seed script — run with:  npx tsx scripts/seed.ts
// Now reuses the shared seed logic from src/server/db/seed.ts
import db, { initSchema } from "../src/server/db";
import { seedDatabase } from "../src/server/db/seed";

initSchema();
seedDatabase(db);

console.log("Seed complete.");
console.log("  admin@nexmansion.com / nexmansion123   (Admin)");
console.log("  host@nexmansion.com  / nexmansion123   (Host)");
console.log("  traveller@nexmansion.com / nexmansion123 (Traveller)");
db.close();
