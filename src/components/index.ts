/**
 * Component Library Index
 * Professional Alloy-JS components for TypeSpec Go generation
 * Following guide's "Domain-Specific Component Libraries" pattern
 */

// Core Generation Components
export { TypeExpression } from "./TypeExpression.js";
export { GoModel } from "./GoModel.js";

// Re-export Alloy-JS Go components for convenience
export {
  SourceFile,
  StructTypeDeclaration,
  StructDeclaration,
  StructMember,
  FunctionDeclaration,
  VariableDeclaration,
  ImportStatements,
  InterfaceDeclaration,
} from "@alloy-js/go";
