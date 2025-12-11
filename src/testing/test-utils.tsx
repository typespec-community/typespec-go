import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import type { Children } from "@alloy-js/core";
import type { OutputDirectory, OutputFile, ContentOutputFile } from "@alloy-js/core";

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
 * Type guard to check if OutputFile is ContentOutputFile
 */
function isContentOutputFile(file: OutputFile): file is ContentOutputFile {
  return file.kind === "file" && "contents" in file;
}

/**
 * Render a Go component and return the generated string content
 * Handles the nested OutputResult structure with proper type safety
 */
export function renderGoContent(children: Children, fileName = "test.go"): string {
  const result = renderGoFragment(children, fileName);

  // Debug: Log the actual structure we're getting
  console.log("🔍 renderGoContent - Raw result:", JSON.stringify(result, null, 2));
  
  // Check if result has the expected structure
  if (!result || !result.contents || !Array.isArray(result.contents) || result.contents.length === 0) {
    console.error("❌ Invalid result structure - missing contents array");
    throw new Error("Failed to extract rendered Go content - empty result");
  }

  // Navigate through the structure: Output -> Module -> Directory -> File -> Content
  try {
    const moduleDir = result.contents[0];
    console.log("🔍 Module directory:", moduleDir);
    
    if (!moduleDir || moduleDir.kind !== "directory" || !Array.isArray(moduleDir.contents) || moduleDir.contents.length === 0) {
      console.error("❌ Invalid module directory structure");
      throw new Error("Failed to extract rendered Go content - empty module directory");
    }
    
    const sourceDir = moduleDir.contents[0];
    console.log("🔍 Source directory:", sourceDir);
    
    if (!sourceDir || sourceDir.kind !== "directory" || !Array.isArray(sourceDir.contents) || sourceDir.contents.length === 0) {
      console.error("❌ Invalid source directory structure");
      throw new Error("Failed to extract rendered Go content - empty source directory");
    }
    
    const sourceFile = sourceDir.contents[0];
    console.log("🔍 Source file:", sourceFile);
    
    if (!sourceFile || sourceFile.kind !== "file" || !isContentOutputFile(sourceFile)) {
      console.error("❌ Invalid source file contents");
      throw new Error("Failed to extract rendered Go content - invalid file contents");
    }
    
    console.log("✅ Successfully extracted Go content:", sourceFile.contents.substring(0, 100) + "...");
    return sourceFile.contents;
  } catch (e) {
    console.error("Failed to extract content from render result:", JSON.stringify(result, null, 2));
    console.error("Error details:", e);
    throw new Error("Failed to extract rendered Go content");
  }
}