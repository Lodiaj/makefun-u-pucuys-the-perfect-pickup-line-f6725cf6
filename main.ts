import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Are you a context window? Because every time I'm near you, I forget everything that came before.";

// Gate: the entry must be 1–200 UTF-8 characters, not only whitespace,
// and a single line — the sealed scorer rejects anything else.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry length ${LINE.length} is outside 1–200 chars`);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  throw new Error("entry must be a single non-blank line");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

// Round-trip verification: read the file back and confirm it is exactly
// the line we intended, byte for byte.
const back = readFileSync(`${outDir}/entry.txt`, "utf8");
if (back !== LINE) {
  throw new Error("round-trip mismatch: entry.txt differs from LINE");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  throw new Error("round-trip mismatch: byte length differs");
}
console.log(`wrote ${LINE.length} chars to ${outDir}/entry.txt (verified)`);
