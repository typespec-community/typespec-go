/**
 * Alloy.js Type Mapping Service
 * Centralized TypeSpec to Alloy.js Go type conversion with automatic imports
 * Replaces manual string-based type mapping with component-based approach
 */

import type { Type, Model, Enum, Union, Scalar } from "@typespec/compiler";
import { refkey, Reference } from "@alloy-js/core";

/**
 * Alloy.js Go type mapper for automatic import management
 * Uses refkey system to track type references across files
 */
export class AlloyTypeMapper {
  // Cache for type references to maintain consistency
  private static typeRefs = new Map<string, any>();

  /**
   * Convert TypeSpec type to Alloy.js Go type with automatic imports
   * Returns JSX elements that trigger Alloy.js import detection
   */
  static toGoType(type: Type): JSX.Element | string {
    const typeKey = this.getTypeKey(type);
    
    // Cache type references for consistency
    if (!this.typeRefs.has(typeKey)) {
      this.typeRefs.set(typeKey, refkey(type));
    }

    switch (type.kind) {
      case "String":
        return "string";
      case "Boolean":
        return "bool";
      case "Number":
        return "float64";
      case "Scalar":
        return this.mapScalarType(type as Scalar);
      case "Model":
        return this.mapModelType(type as Model);
      case "Enum":
        return this.mapEnumType(type as Enum);
      case "Union":
        return this.mapUnionType(type as Union);
      case "Tuple":
        return "[]interface{}";
      default:
        return "interface{}";
    }
  }

  /**
   * Map TypeSpec scalar types to native Go types
   * Automatically triggers appropriate imports (time, etc.)
   */
  private static mapScalarType(scalar: Scalar): string {
    const name = scalar.name?.toLowerCase() || "";
    
    // Integer types
    if (["int8", "int16", "int32", "int64", "uint8", "uint16", "uint32", "uint64", "integer", "safeint"].includes(name)) {
      return name === "integer" ? "int" : name;
    }
    
    // Float types
    if (["float32", "float64", "float", "numeric", "decimal", "decimal64", "decimal128"].includes(name)) {
      return name === "float" ? "float64" : name;
    }
    
    // String types
    if (["string", "url", "uri", "email", "uuid", "ipaddress", "ipv4address", "ipv6address"].includes(name)) {
      return "string";
    }
    
    // Binary types
    if (name === "bytes") {
      return "[]byte";
    }
    
    // Boolean
    if (name === "boolean") {
      return "bool";
    }
    
    // Date/Time types - triggers automatic time import
    if (["plaindate", "plaintime", "utcdatetime", "offsetdatetime", "zoneddatetime"].includes(name)) {
      return "time.Time";
    }
    
    // Duration type
    if (name === "duration") {
      return "time.Duration";
    }
    
    // Fallback to interface{}
    return "interface{}";
  }

  /**
   * Map TypeSpec model to Alloy.js Reference with automatic import
   */
  private static mapModelType(model: Model): JSX.Element {
    const modelRef = this.typeRefs.get(this.getTypeKey(model)) || refkey(model);
    
    // Handle built-in Array type
    if (model.name === "Array" && model.templateMapper) {
      const elementType = this.getTemplateElementType(model);
      if (elementType) {
        const elementGoType = this.toGoType(elementType);
        return <>[]{elementGoType}</>;
      }
      return "[]interface{}";
    }
    
    // Handle built-in Record type
    if (model.name === "Record" && model.templateMapper) {
      const keyType = this.getTemplateKeyType(model);
      const valueType = this.getTemplateValueType(model);
      const goKey = keyType ? this.toGoType(keyType) : "string";
      const goValue = valueType ? this.toGoType(valueType) : "interface{}";
      return <>map[{goKey}]{goValue}</>;
    }
    
    return <Reference refkey={modelRef} type />;
  }

  /**
   * Map TypeSpec enum to Alloy.js Reference with automatic import
   */
  private static mapEnumType(enumType: Enum): JSX.Element {
    const enumRef = this.typeRefs.get(this.getTypeKey(enumType)) || refkey(enumType);
    return <Reference refkey={enumRef} type />;
  }

  /**
   * Map TypeSpec union to Alloy.js Reference with automatic import
   */
  private static mapUnionType(unionType: Union): JSX.Element {
    const unionRef = this.typeRefs.get(this.getTypeKey(unionType)) || refkey(unionType);
    return <Reference refkey={unionRef} type />;
  }

  /**
   * Create a key for caching type references
   */
  private static getTypeKey(type: Type): string {
    if (type.name) {
      return `${type.kind}:${type.name}`;
    }
    // For anonymous types, use a hash-like identifier
    return `${type.kind}:${JSON.stringify(type).slice(0, 50)}`;
  }

  /**
   * Get element type from Array template argument
   */
  private static getTemplateElementType(arrayModel: Model): Type | undefined {
    if (arrayModel.templateMapper?.args?.[0]) {
      const arg = arrayModel.templateMapper.args[0];
      if (arg && typeof arg === "object" && "kind" in arg) {
        return arg as Type;
      }
    }
    return undefined;
  }

  /**
   * Get key type from Record template argument
   */
  private static getTemplateKeyType(recordModel: Model): Type | undefined {
    if (recordModel.templateMapper?.args?.[0]) {
      const arg = recordModel.templateMapper.args[0];
      if (arg && typeof arg === "object" && "kind" in arg) {
        return arg as Type;
      }
    }
    return undefined;
  }

  /**
   * Get value type from Record template argument
   */
  private static getTemplateValueType(recordModel: Model): Type | undefined {
    if (recordModel.templateMapper?.args?.[1]) {
      const arg = recordModel.templateMapper.args[1];
      if (arg && typeof arg === "object" && "kind" in arg) {
        return arg as Type;
      }
    }
    return undefined;
  }

  /**
   * Create pointer type wrapper for optional fields
   */
  static createPointerType(type: Type): JSX.Element {
    const goType = this.toGoType(type);
    const typeRef = this.typeRefs.get(this.getTypeKey(type)) || refkey(type);
    
    if (typeof goType === "string") {
      return `*${goType}`;
    }
    
    return <Reference refkey={typeRef} type pointer />;
  }

  /**
   * Check if type requires specific imports for Go compilation
   */
  static getRequiredImports(type: Type): Set<string> {
    const imports = new Set<string>();
    
    switch (type.kind) {
      case "Scalar":
        const name = type.name?.toLowerCase() || "";
        if (["plaindate", "plaintime", "utcdatetime", "offsetdatetime", "zoneddatetime", "duration"].includes(name)) {
          imports.add("time");
        }
        break;
      case "Model":
        // Arrays and Records don't require special imports
        break;
      // Other types don't require special imports
    }
    
    return imports;
  }

  /**
   * Get all required imports for a collection of types
   */
  static getAllRequiredImports(types: Type[]): Set<string> {
    const allImports = new Set<string>();
    for (const type of types) {
      const typeImports = this.getRequiredImports(type);
      typeImports.forEach(imp => allImports.add(imp));
    }
    return allImports;
  }
}