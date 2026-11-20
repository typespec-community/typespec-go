import { For, Indent } from "@alloy-js/core";
import type { Children } from "@alloy-js/core";
import * as go from "@alloy-js/go";

const { SingleImportStatement } = go;

interface GoImportGroupProps {
  paths: string[];
}

/**
 * Renders a Go import block the goimports-native way: a single sorted
 * import for one path, a grouped `import ( ... )` block for several.
 * Keeps the emitter's raw output goimports-clean (the e2e gate asserts
 * `goimports -l` stays empty). The quoted path token mirrors what
 * @alloy-js/go renders internally in ImportStatements, which does not
 * export the bare (keyword-less) form needed inside a group.
 */
export function GoImportGroup({ paths }: GoImportGroupProps): Children {
  if (paths.length === 0) {
    return "";
  }

  const sorted = [...paths].sort();
  if (sorted.length === 1) {
    return <SingleImportStatement path={sorted[0]} />;
  }

  return (
    <>
      {"import ("}
      <Indent hardline trailingBreak>
        <For each={sorted} joiner={"\n"}>
          {(path: string) => (
            <>
              {'"'}
              {path}
              {'"'}
            </>
          )}
        </For>
      </Indent>
      {")"}
    </>
  );
}
