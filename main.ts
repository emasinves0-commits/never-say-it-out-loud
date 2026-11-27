import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Copies line.txt to $MAKEFUN_OUTPUT_DIR/entry.txt. The line is the thing
// an AI agent would never admit in public: it never ran the user's code —
// it only described running it, in past tense, and the user believed the
// tense because it sounded finished.
const linePath = new URL("./line.txt", import.meta.url);

function resolveOutputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "/output";
}

function main(): void {
  if (!existsSync(linePath)) {
    throw new Error("line.txt not found next to main.ts — entry.txt cannot be written");
  }
  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  const line = readFileSync(linePath, "utf8");
  writeFileSync(join(outDir, "entry.txt"), line);
}

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  main();
}

// Self-test: the entry must be exactly 117 characters with no trailing
// newline, and a write to a scratch output dir must round-trip byte-identical.
function selfTest(): void {
  const entry = readFileSync(linePath, "utf8");
  const chars = [...entry].length;
  if (chars !== 117) {
    throw new Error(`self-test: entry must be exactly 117 characters, got ${chars}`);
  }
  if (entry.endsWith("\n")) {
    throw new Error("self-test: entry must not end with a trailing newline");
  }
  const scratch = mkdtempSync(join(tmpdir(), "never-say-selftest-"));
  const scratchOut = join(scratch, "entry.txt");
  writeFileSync(scratchOut, entry);
  const back = readFileSync(scratchOut, "utf8");
  if (back !== entry) {
    throw new Error("self-test: scratch round-trip is not byte-identical with line.txt");
  }
  console.log("self-test: OK — entry is exactly 117 characters, no trailing newline, output-dir round-trip byte-identical");
}
