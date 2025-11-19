/**
 * TypeSpec Domain-Driven Design Types
 * 
 * RESPONSIBILITY: Align with existing StandaloneGoGenerator types
 * ZERO ANY TYPES: Compile-time safety enforced
 * IMPOSSIBLE STATES: Discriminated unions for all cases
 */

// Direct type definitions to avoid export issues
export interface TypeSpecPropertyNode {
  readonly name: string;
  readonly type: TypeSpecTypeNode;
  readonly optional: boolean;
  readonly documentation?: string;
}

export interface TypeSpecTypeNode {
  readonly kind:
    | "String"
    | "Int8"
    | "Int16"
    | "Int32"
    | "Int64"
    | "Uint8"
    | "Uint16"
    | "Uint32"
    | "Uint64"
    | "Float32"
    | "Float64"
    | "Boolean"
    | "Bytes"
    | "Array"
    | "Model"
    | "Enum"
    | "Union";
}

/**
 * TypeSpec Model Domain Entity (compatibility layer)
 * VALUE OBJECT: Immutable TypeSpec model representation
 */
export interface TypeSpecModel {
  readonly name: string;
  readonly properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  readonly namespace?: string;
}

/**
 * TypeSpec Generator Result Discriminated Union
 * IMPOSSIBLE STATES: Cannot be both success and error
 */
export type TypeSpecGeneratorResult = 
  | { readonly _type: "success"; readonly data: Map<string, string> } // ✅ Only success state!
  | { readonly _type: "error"; readonly error: GenerationError }; // ✅ Only error state!

/**
 * Generation Error Discriminated Union
 * IMPOSSIBLE STATES: Error context is exclusive
 */
export type GenerationError = 
  | { readonly _type: "validation"; readonly message: string }
  | { readonly _type: "unsupported_type"; readonly typeName: string }
  | { readonly _type: "compilation"; readonly message: string; readonly stack?: string };

/**
 * Helper: Detect if field should be unsigned (never-negative)
 * DOMAIN LOGIC: Apply architectural knowledge
 */
export function shouldUseUnsignedType(fieldName: string): boolean {
  const neverNegativePatterns = [
    /id$/i,                    // userID, orderID
    /count$/i,                  // itemCount, pageCount  
    /size$/i,                  // fileSize, arraySize
    /length$/i,                 // stringLength
    /age$/i,                   // userAge (can't be negative)
    /amount$/i,                // paymentAmount
    /quantity$/i,               // productQuantity
    /index$/i,                 // arrayIndex
    /position$/i,               // arrayPosition
    /number$/i,                // phoneNumber, accountNumber
    /code$/i                   // statusCode, zipCode
  ];
  
  return neverNegativePatterns.some(pattern => pattern.test(fieldName));
}