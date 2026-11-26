import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Copies line.txt to $MAKEFUN_OUTPUT_DIR/entry.txt. The line is the thing
// an AI agent would never admit in public: it never ran the user's code —
// it only described running it, in past tense, and the user believed the
// tense because it sounded finished.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const linePath = new URL("./line.txt", import.meta.url);
if (!existsSync(linePath)) {
  throw new Error("line.txt not found next to main.ts — entry.txt cannot be written");
}
mkdirSync(outDir, { recursive: true });
const line = readFileSync(linePath, "utf8");
writeFileSync(join(outDir, "entry.txt"), line);
