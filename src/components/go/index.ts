/**
 * Go Component Library Index
 * Professional Alloy-JS Go components for TypeSpec generation
 * Using correct Alloy-JS Go component exports
 */

// Core generation components
export { GoStructDeclaration } from "./GoStructDeclaration.js";
export { GoPackageDirectory } from "./GoPackageDirectory.js";

// Re-export Alloy-JS Go components for convenience
export {
  ModuleDirectory,
  SourceDirectory,
  SourceFile,
  TypeDeclaration,
  StructDeclaration,
  StructMember,
  StructEmbed,
  FunctionDeclaration,
  FunctionReceiver,
  ImportStatements,
  SingleImportStatement,
  VariableDeclaration,
  InterfaceDeclaration,
} from "@alloy-js/go";

// Re-export Alloy-JS core components
export {
  Output,
  refkey,
  For, // For component from core for iteration
} from "@alloy-js/core";