import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = join(dirname(fileURLToPath(import.meta.url)), "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

if (!existsSync(source)) {
  throw new Error(`entry.png not found next to main.ts (${source})`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Post-copy check: the delivered file must be a whole, non-empty image
// within the competition limit (at most 1 MiB).
const { size } = statSync(target);
if (size === 0 || size > 1048576) {
  throw new Error(`entry.png copy is ${size} bytes, expected 1..1048576`);
}
console.log(`wrote ${target} (${size} bytes)`);
