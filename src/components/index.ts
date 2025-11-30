/**
 * Component Library Index
 * Professional Alloy-JS components for TypeSpec Go generation
 * Following guide's "Domain-Specific Component Libraries" pattern
 */

// Core Go Generation Components
export * from "./go/index.js";

// Legacy Components (to be removed)
// export { TypeExpression } from "./TypeExpression.js";
// export { GoModel } from "./GoModel.js";

// Re-export Alloy-JS core components
export {
  Output,
  SourceDirectory,
  SourceFile,
  refkey,
  createRefkey,
} from "@alloy-js/core";
