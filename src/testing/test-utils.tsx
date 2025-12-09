import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import type { Children } from "@alloy-js/core";

/**
 * Render a Go component within a proper Alloy-JS context
 */
export function renderGoFragment(children: Children, fileName = "test.go") {
  return render(
    <Output basePath="./">
      <ModuleDirectory name="github.com/test/api">
        <SourceDirectory path="api">{children}</SourceDirectory>
      </ModuleDirectory>
    </Output>,
  );
}

/**
 * Render a Go component and return the generated string content
 * Handles the nested OutputResult structure
 */
export function renderGoContent(children: Children, fileName = "test.go"): string {
  const result = renderGoFragment(children, fileName);

  // Navigate the structure: Output -> Module -> Directory -> File -> Content
  // This structure assumes single module, single directory, single file
  try {
    const moduleDir = result.contents[0] as any;
    const sourceDir = moduleDir.contents[0] as any;
    const sourceFile = sourceDir.contents[0] as any;
    return sourceFile.contents;
  } catch (e) {
    console.error("Failed to extract content from render result:", JSON.stringify(result, null, 2));
    throw new Error("Failed to extract rendered Go content");
  }
}
