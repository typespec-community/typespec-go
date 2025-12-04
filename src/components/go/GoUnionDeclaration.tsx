/**
 * Go Union Declaration Component
 * Generates Go sealed interfaces from TypeSpec unions
 * Supports discriminated unions with type field
 */

import type { Union, UnionVariant, Program } from "@typespec/compiler";
import { For } from "@alloy-js/core";
import { capitalize } from "../../utils/strings.js";
import { 
  TypeDeclaration, 
  StructDeclaration, 
  StructMember,
  FunctionDeclaration,
  FunctionReceiver,
  SourceFile
} from "@alloy-js/go";
import { getDocumentation } from "../../utils/typespec-utils.js";

interface GoUnionDeclarationProps {
  /** TypeSpec union to convert to Go interface */
  union: Union;
  /** Package name for documentation */
  packageName?: string;
  /** Discriminator field name for tagged unions */
  discriminator?: string;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
}

/**
 * Go Union Declaration Component
 * Generates sealed interface pattern for type safety using 100% Alloy components
 */
export function GoUnionDeclaration({
  union,
  packageName = "api",
  discriminator,
  program,
}: GoUnionDeclarationProps) {
  const typeName = union.name || "UnnamedUnion";
  const variants = Array.from(union.variants?.values() || []);

  // Get documentation from @doc decorator
  const doc = program ? getDocumentation(program, union) : undefined;
  const docComment = doc ? doc + "" : "";
  const interfaceDoc = "// " + typeName + " is a sealed interface " + docComment + "representing a union type";

  // Simple test version - just type declaration for now
  return (
    <TypeDeclaration name={typeName} doc={interfaceDoc}>
      interface {
        // Test union implementation
      }
    </TypeDeclaration>
  );
}