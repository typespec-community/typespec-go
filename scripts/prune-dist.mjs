#!/usr/bin/env node
/**
 * Removes non-runtime artifacts from dist/ after `alloy build`:
 * compiled test files (dist/test) and stray .jsx duplicates that no
 * import references. Keeps the published package lean.
 */
import { rmSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";

const distDir = resolve(new URL("..", import.meta.url).pathname, "dist");
const testDir = join(distDir, "test");
rmSync(testDir, { recursive: true, force: true });

function pruneJsx(dir) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			pruneJsx(full);
		} else if (entry.endsWith(".jsx")) {
			unlinkSync(full);
		}
	}
}
pruneJsx(distDir);

console.log("pruned dist/test and .jsx duplicates");
