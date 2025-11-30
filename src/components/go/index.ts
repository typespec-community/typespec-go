/**
 * Go Component Library Index
 * Professional Alloy-JS Go components for TypeSpec generation
 * Following guide's component library pattern
 */

// Core generation components
export { GoStructDeclaration } from "./GoStructDeclaration.js";
export { GoFieldDeclaration } from "./GoFieldDeclaration.js";
export { GoImportManager } from "./GoImportManager.js";
export { GoPackageDirectory } from "./GoPackageDirectory.js";

// Documentation components
export { 
  GoDocumentation, 
  PackageDocumentation, 
  StructDocumentation, 
  MethodDocumentation, 
  FieldDocumentation 
} from "./GoDocumentation.js";

// Type expression component
export { GoTypeExpression, TypeExpression } from "./TypeExpression.js";

// Re-export Alloy-JS Go components for convenience
export {
  SourceFile,
  ImportStatement,
  StructTypeDeclaration,
  StructMember,
  InterfaceDeclaration,
  FunctionDeclaration,
  MethodDeclaration,
  VariableDeclaration,
  TypeDeclaration,
  SourceDirectory,
  Output,
  refkey,
  createRefkey,
} from "@alloy-js/core";

export {
  StructDeclaration,
  StructTypeDeclaration as GoStructTypeDeclaration,
  StructMember as GoStructMember,
  FunctionDeclaration as GoFunctionDeclaration,
  MethodDeclaration as GoMethodDeclaration,
  VariableDeclaration as GoVariableDeclaration,
  InterfaceDeclaration as GoInterfaceDeclaration,
  TypeDeclaration as GoTypeDeclaration,
} from "@alloy-js/go";