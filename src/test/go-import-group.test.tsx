/**
 * GoImportGroup: the goimports-native import block component. One path
 * renders a single import; several render a sorted grouped block with
 * tab-indented members (what `goimports -l` expects).
 */

import { describe, expect, test } from "vitest";
import { GoImportGroup } from "../components/go/GoImportGroup.js";
import { renderGoContent } from "../testing/test-utils.js";

describe("GoImportGroup", () => {
  test("renders a single import statement for one path", () => {
    const result = renderGoContent(<GoImportGroup paths={["time"]} />);

    expect(result).toContain('import "time"');
    expect(result).not.toContain("import (");
  });

  test("renders a sorted grouped block for several paths", () => {
    const result = renderGoContent(<GoImportGroup paths={["net/http", "context"]} />);

    const contextIdx = result.indexOf('"context"');
    const httpIdx = result.indexOf('"net/http"');
    expect(result).toContain("import (");
    expect(result).toContain(")");
    expect(contextIdx).toBeGreaterThan(-1);
    expect(httpIdx).toBeGreaterThan(contextIdx);
  });

  test("renders nothing for an empty path list", () => {
    const result = renderGoContent(<GoImportGroup paths={[]} />);

    expect(result).not.toContain("import");
  });
});
