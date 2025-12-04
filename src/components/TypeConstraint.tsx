/**
 * Type Constraint Component
 * Generates Go 1.18+ generic type constraints from TypeSpec templates
 * Supports interface constraints, built-in constraints, and union constraints
 */

import type { Type, Model, Scalar, Union, TemplateParameter } from "@typespec/compiler";
import { isNullType } from "@typespec/compiler";
import { capitalize } from "../../utils/strings.js";
import { getDocumentation } from "../../utils/typespec-utils.js";

/**
 * Type guard for Scalar types
 */
function isScalar(type: Type): type is Scalar {
  return type.kind === "Scalar";
}

/**
 * Type guard for Model types
 */
function isModel(type: Type): type is Model {
  return type.kind === "Model";
}

/**
 * Type guard for Union types
 */
function isUnion(type: Type): type is Union {
  return type.kind === "Union";
}

/**
 * Type guard for TemplateParameter types
 */
function isTemplateParameter(type: Type): type is TemplateParameter {
  return type.kind === "TemplateParameter";
}

/**
 * Maps TypeSpec scalar types to Go types for constraints
 */
const SCALAR_MAPPINGS: Record<string, string> = {
  string: "string",
  boolean: "bool",
  int8: "int8",
  int16: "int16",
  int32: "int32",
  int64: "int64",
  uint8: "uint8",
  uint16: "uint16",
  uint32: "uint32",
  uint64: "uint64",
  float32: "float32",
  float64: "float64",
  bytes: "[]byte",
  plaindate: "time.Time",
  plainTime: "time.Time",
  duration: "time.Duration",
  utcDateTime: "time.Time",
  offsetDateTime: "time.Time",
} as const;

interface TypeConstraintProps {
  /** Name of the type parameter (T, K, V, etc.) */
  typeParameter: string;
  /** Type constraints (types, interfaces, built-in constraints) */
  constraints: Type[];
  /** Whether this is for interface or struct constraint */
  constraintType?: 'interface' | 'struct';
  /** Documentation for the constraint */
  documentation?: string;
  /** TypeSpec program for accessing @doc decorators */
  program?: any;
  /** Package name for documentation */
  packageName?: string;
}

/**
 * Converts a single TypeSpec type to Go constraint syntax
 */
function typeToConstraint(type: Type): string {
  // Handle Scalar types (string, int32, bool, etc.)
  if (isScalar(type)) {
    const scalarName = type.name?.toLowerCase() || "";
    return SCALAR_MAPPINGS[scalarName] || "any";
  }

  // Handle Model types (user-defined types)
  if (isModel(type)) {
    return type.name || "any";
  }

  // Handle Union types (string | number | boolean)
  if (isUnion(type)) {
    const variants = Array.from(type.variants?.values() || []);
    const constraintVariants = variants.map((v) => {
      // Skip null variants in constraints
      if (isNullType(v.type)) return null;
      return typeToConstraint(v.type);
    }).filter(Boolean);

    if (constraintVariants.length === 0) return "any";
    if (constraintVariants.length === 1) return constraintVariants[0]!;
    
    // Go uses | for union type constraints
    return constraintVariants.join(" | ");
  }

  // Handle Template parameters
  if (isTemplateParameter(type)) {
    return type.name || "any";
  }

  // Fallback
  return "any";
}

/**
 * Generate constraint name based on type parameter and constraints
 */
function generateConstraintName(typeParameter: string, constraints: Type[]): string {
  if (constraints.length === 0) return "any";
  if (constraints.length === 1) {
    const constraint = typeToConstraint(constraints[0]);
    return `${capitalize(typeParameter)}${constraint.replace(/[^a-zA-Z0-9]/g, '')}Constraint`;
  }
  return `${capitalize(typeParameter)}Constraint`;
}

/**
 * Type Constraint Component
 * Generates Go 1.18+ generic type constraints
 */
export function TypeConstraint({
  typeParameter,
  constraints,
  constraintType = 'interface',
  documentation,
  program,
  packageName = "api",
}: TypeConstraintProps): string {
  // If no constraints, use 'any'
  if (constraints.length === 0) {
    return "any";
  }

  const constraintName = generateConstraintName(typeParameter, constraints);
  
  // Get documentation
  const doc = documentation || (program && program ? getDocumentation(program, { name: constraintName }) : undefined);
  const docComment = doc ? `// ${doc}` : `// ${constraintName} defines type constraints for ${typeParameter}`;

  // Handle single built-in constraint (comparable, any)
  if (constraints.length === 1) {
    const singleConstraint = typeToConstraint(constraints[0]);
    
    // Check for built-in constraints
    if (singleConstraint === "comparable" || singleConstraint === "any") {
      return singleConstraint;
    }
    
    // For single interface constraint, we might not need a separate type
    if (isModel(constraints[0]) && !constraints[0].template) {
      return singleConstraint;
    }
  }

  // Generate constraint types
  const constraintTypes = constraints.map(typeToConstraint);
  const hasUnionTypes = constraintTypes.some(t => t.includes(" | "));
  
  // Build the constraint definition
  const lines: string[] = [];
  
  // Add documentation
  if (docComment) {
    lines.push(docComment);
  }

  if (constraintType === 'interface') {
    lines.push(`type ${constraintName} interface {`);
    
    // Add built-in constraints first
    if (constraintTypes.includes("comparable")) {
      lines.push("\tcomparable");
    }
    
    // Add custom constraints
    for (const constraint of constraintTypes) {
      // Skip built-in constraints already added
      if (constraint === "comparable" || constraint === "any") continue;
      
      // Handle union types
      if (constraint.includes(" | ")) {
        lines.push(`\t${constraint}`);
      } else if (constraint !== "any") {
        lines.push(`\t${constraint}`);
      }
    }
    
    lines.push("}");
  } else {
    // For struct constraints, use type alias
    if (hasUnionTypes) {
      lines.push(`type ${constraintName} = ${constraintTypes.join(" | ")}`);
    } else {
      lines.push(`type ${constraintName} ${constraintTypes.join(" | ")}`);
    }
  }

  return lines.join("\n");
}

/**
 * Generates generic parameter syntax for Go functions/types
 * [T constraint] or [T any] or [T comparable]
 */
export function GenericParameter({
  typeParameter,
  constraints,
}: {
  typeParameter: string;
  constraints: Type[];
}): string {
  if (constraints.length === 0) {
    return `[${typeParameter} any]`;
  }

  const constraintTypes = constraints.map(typeToConstraint);
  
  // Handle built-in constraints directly
  if (constraintTypes.length === 1) {
    const constraint = constraintTypes[0];
    if (constraint === "any" || constraint === "comparable" || isModel(constraints[0])) {
      return `[${typeParameter} ${constraint}]`;
    }
  }

  // For complex constraints, use the named constraint
  const constraintName = generateConstraintName(typeParameter, constraints);
  return `[${typeParameter} ${constraintName}]`;
}

/**
 * Extract template parameters from a TypeSpec model
 */
export function extractTemplateParameters(model: Model): TemplateParameter[] {
  const params: TemplateParameter[] = [];
  
  if (model.template) {
    for (const param of model.template.parameters) {
      if (isTemplateParameter(param)) {
        params.push(param);
      }
    }
  }
  
  return params;
}

/**
 * Extract constraints from TypeSpec template arguments
 */
export function extractTemplateConstraints(model: Model): { param: TemplateParameter; constraints: Type[] }[] {
  const constraints: { param: TemplateParameter; constraints: Type[] }[] = [];
  
  if (model.template) {
    for (const param of model.template.parameters) {
      if (isTemplateParameter(param)) {
        // Extract constraints from parameter if available
        const paramConstraints: Type[] = [];
        
        // Check if parameter has explicit constraints
        if ((param as any).constraint) {
          paramConstraints.push((param as any).constraint);
        }
        
        constraints.push({ param, constraints: paramConstraints });
      }
    }
  }
  
  return constraints;
}