#!/usr/bin/env node
/**
 * End-to-end CLI proof: compiles the example TypeSpec with the real
 * `tsp` compiler and the BUILT emitter, then verifies the generated Go.
 *
 * Requires `dist/` to exist (run `npm run build` first).
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const distMain = join(repoRoot, "dist", "main.js");
const exampleTsp = join(repoRoot, "examples", "basic", "main.tsp");

function fail(message) {
  console.error(`❌ e2e-cli: ${message}`);
  process.exit(1);
}

if (!existsSync(distMain)) {
  fail("dist/main.js missing — run `npm run build` before `npm run test:e2e-cli`");
}

// The emitter resolves by package name; link this repo into node_modules
// (idempotent, mirrors `npm link`).
const linkDir = join(repoRoot, "node_modules", "@typespec-community");
const linkPath = join(linkDir, "typespec-go");
mkdirSync(linkDir, { recursive: true });
if (!existsSync(linkPath)) {
  symlinkSync(join(repoRoot), linkPath, "dir");
}

const outputDir = join(tmpdir(), `typespec-go-e2e-cli-${process.pid}`);
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const tspBin = join(repoRoot, "node_modules", ".bin", "tsp");
const result = spawnSync(
  tspBin,
  [
    "compile",
    exampleTsp,
    "--emit",
    "@typespec-community/typespec-go",
    "--option",
    `@typespec-community/typespec-go.emitter-output-dir=${outputDir}`,
  ],
  { encoding: "utf8", cwd: repoRoot },
);

if (result.status !== 0) {
  console.error(result.stdout);
  console.error(result.stderr);
  fail(`tsp compile exited ${result.status}`);
}

const generatedFiles = [];
function collectGoFiles(dir) {
  for (const entry of readdirSync(dir).toSorted()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectGoFiles(full);
    else if (entry.endsWith(".go")) generatedFiles.push(full);
  }
}
collectGoFiles(outputDir);

if (generatedFiles.length === 0) fail("no .go files generated");

const content = generatedFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const expectations = [
  ["type Widget struct", true, "Widget model generated"],
  ["ID string", true, "Widget.id field generated"],
  ["Weight int32", true, "Widget.weight field generated"],
  ["Color string", true, 'inline union "red" | "blue" mapped to string'],
  ["type Error struct", true, "@error model generated"],
  ["<Unresolved Symbol>", false, "no unresolved references"],
];

for (const [needle, expected, why] of expectations) {
  const present = content.includes(needle);
  if (expected && !present) fail(`generated output missing '${needle}' (${why})`);
  if (!expected && present) fail(`generated output must not contain '${needle}' (${why})`);
}

console.log(`✅ e2e-cli: tsp compile produced ${generatedFiles.length} Go file(s):`);
for (const file of generatedFiles) console.log(`   ${file}`);

// Go conformance: generated code must be syntactically valid Go
// (gofmt parse check) and must survive gofmt normalization cleanly.
const gofmt = spawnSync("gofmt", ["-e", ...generatedFiles], { encoding: "utf8" });
if (gofmt.status !== 0) {
  console.error(gofmt.stderr);
  fail("generated Go has syntax errors (gofmt -e failed)");
}
const normalized = spawnSync("gofmt", ["-w", ...generatedFiles], { encoding: "utf8" });
if (normalized.status !== 0) {
  console.error(normalized.stderr);
  fail("gofmt -w failed on generated Go");
}
const listed = spawnSync("gofmt", ["-l", ...generatedFiles], { encoding: "utf8" });
if (listed.status !== 0 || listed.stdout.trim() !== "") {
  fail("generated Go not gofmt-clean after normalization");
}
console.log("✅ e2e-cli: generated Go passes gofmt conformance");

rmSync(outputDir, { recursive: true, force: true });
