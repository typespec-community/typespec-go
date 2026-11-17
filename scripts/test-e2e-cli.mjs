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
const examples = ["examples/basic/main.tsp", "examples/crud/main.tsp"];
const generatedFiles = [];
const seenGoFiles = new Set();
const moduleRoots = [];
const compileWallClockMs = {};

function findGoMod(dir) {
	for (const entry of readdirSync(dir).toSorted()) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			const found = findGoMod(full);
			if (found) return found;
		} else if (entry === "go.mod") {
			return dir;
		}
	}
	return undefined;
}

for (const example of examples) {
	const exampleOutput = join(outputDir, example.replaceAll("/", "_"));
	mkdirSync(exampleOutput, { recursive: true });
	const moduleSlug = example.split("/")[1];
	const compileStarted = performance.now();
	const result = spawnSync(
		tspBin,
		[
			"compile",
			join(repoRoot, example),
			"--emit",
			"@typespec-community/typespec-go",
			"--option",
			`@typespec-community/typespec-go.emitter-output-dir=${exampleOutput}`,
			"--option",
			`@typespec-community/typespec-go.go-module-path=example.com/typespec-go-e2e/${moduleSlug}`,
		],
		{ encoding: "utf8", cwd: repoRoot },
	);
	compileWallClockMs[example] = Math.round(performance.now() - compileStarted);
	if (result.status !== 0) {
		console.error(result.stdout);
		console.error(result.stderr);
		fail(`tsp compile for ${example} exited ${result.status}`);
	}
	collectGoFilesInto(exampleOutput, generatedFiles);
	const moduleRoot = findGoMod(exampleOutput);
	if (!moduleRoot) fail(`no go.mod generated for ${example} (go-module-path option ignored?)`);
	moduleRoots.push({ example, root: moduleRoot });
}

function collectGoFilesInto(dir, into) {
	for (const entry of readdirSync(dir).toSorted()) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) collectGoFilesInto(full, into);
		else if (entry.endsWith(".go") && !seenGoFiles.has(full)) {
			seenGoFiles.add(full);
			into.push(full);
		}
	}
}

if (generatedFiles.length === 0) fail("no .go files generated");

const content = generatedFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const expectations = [
	["type Widget struct", true, "Widget model generated"],
	["ID     string", true, "Widget.id field generated"],
	["Weight int32", true, "Widget.weight field generated"],
	["Color  string", true, 'inline union "red" | "blue" mapped to string'],
	["type Error struct", true, "@error model generated"],
	["<Unresolved Symbol>", false, "no unresolved references"],
	["Status         OrderStatus", true, "named enum cross-file reference resolves"],
	["Payment        PaymentMethod", true, "named union cross-file reference resolves"],
	["func (e OrderError) Error() string", true, "@error model generates error interface"],
	["func (s *DemoserviceService) listHandler(", true, "interface op becomes handler method"],
	['mux.HandleFunc("/widgets"', true, "@route path lands in registration"],
	['mux.HandleFunc("/widgets/{id}"', true, "parameterized route registered"],
	['r.PathValue("id")', true, "path params extracted from request"],
	["json.NewDecoder(r.Body).Decode(&widget)", true, "body params decoded from request"],
	["context.Background()", true, "handler context adapted"],
	["Notes          string", true, "@go.nullable(zeroValue) keeps optional scalar flat"],
	["OrderReference string", true, "@go.name overrides field name"],
	["OrderPriorityLow OrderPriority = iota", true, "@go.enumMode(iota) renders iota constants"],
	[
		"// Go types from TypeSpec namespace: Orders\npackage orders",
		true,
		"package doc hoisted above package clause",
	],
	["type Page[T any] struct", true, "template model emits as Go generic"],
	["Items []T", true, "template parameter type resolves inside generic struct"],
];

for (const [needle, expected, why] of expectations) {
	const present = content.includes(needle);
	if (expected && !present) fail(`generated output missing '${needle}' (${why})`);
	if (!expected && present) fail(`generated output must not contain '${needle}' (${why})`);
}

console.log(`✅ e2e-cli: tsp compile produced ${generatedFiles.length} Go file(s):`);
for (const file of generatedFiles) console.log(`   ${file}`);
console.log(
	`⏱️  e2e-cli: compile wall-clock (ms): ${Object.entries(compileWallClockMs)
		.map(([example, ms]) => `${example}=${ms}`)
		.join(", ")}`,
);

// Go build conformance: the RAW generated output (before any gofmt
// normalization) must compile as a Go module — this is the product's
// trust anchor: nothing ships that does not build.
for (const { example, root } of moduleRoots) {
	const build = spawnSync("go", ["build", "./..."], { encoding: "utf8", cwd: root });
	if (build.status !== 0) {
		console.error(build.stdout);
		console.error(build.stderr);
		fail(`generated Go for ${example} does not compile (go build ./... failed in ${root})`);
	}
}
console.log("✅ e2e-cli: generated Go compiles (go build ./... green on all module roots)");

// Go conformance: generated code must be syntactically valid Go (gofmt -e)
// and natively gofmt-clean (gofmt -l) — no normalization step: the emitter's
// raw output IS the deliverable.
const gofmt = spawnSync("gofmt", ["-e", ...generatedFiles], { encoding: "utf8" });
if (gofmt.status !== 0) {
	console.error(gofmt.stderr);
	fail("generated Go has syntax errors (gofmt -e failed)");
}
const listed = spawnSync("gofmt", ["-l", ...generatedFiles], { encoding: "utf8" });
if (listed.status !== 0 || listed.stdout.trim() !== "") {
	console.error(`gofmt -l flagged:\n${listed.stdout}`);
	fail("generated Go is not natively gofmt-clean (gofmt -l)");
}
console.log("✅ e2e-cli: generated Go is natively gofmt-clean");

rmSync(outputDir, { recursive: true, force: true });
