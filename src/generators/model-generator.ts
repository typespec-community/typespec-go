/**
 * TypeSpec Model to Go Struct Generator
 *
 * Core generator for TypeSpec models to Go structs
 * Domain-driven design with intelligent type mapping
 */

import type { Program } from "@typespec/compiler";
import { BaseGenerator } from "./base-generator.js";
import type { GoEmitterResult } from "../domain/unified-errors.js";
import { ErrorFactory } from "../domain/error-factory.js";
import { GoTypeMapper } from "../domain/go-type-mapper.js";
import { ModelExtractor } from "../emitter/model-extractor.js";

/**
 * TypeSpec Model Generator
 * DOMAIN LOGIC: TypeSpec models to Go structs conversion
 */
export class ModelGenerator extends BaseGenerator {
  readonly name = "model-generator";
  readonly description = "TypeSpec models to Go structs generator";

  async generate(program: Program): Promise<GoEmitterResult> {
    // Input validation
    const validation = this.validateInput(program);
    if (validation) {
      return validation;
    }

    try {
      // Extract models, unions, and operations using modular extractor
      const models = ModelExtractor.extractModels(program);
      const unions = ModelExtractor.extractUnions(program);
      const operations = ModelExtractor.extractOperations(program);
      const allGeneratedFiles = new Map<string, string>();

      // Generate Go struct for each model
      for (const [modelName, extractedModel] of models) {
        const goStruct = this.generateGoStruct(modelName, extractedModel);
        const fileName = this.getFileName(modelName);
        allGeneratedFiles.set(fileName, goStruct);
      }

      // Generate Go interface for each union
      for (const [unionName, extractedUnion] of unions) {
        const goInterface = this.generateGoUnionInterface(unionName, extractedUnion);
        const fileName = this.getFileName(unionName);
        allGeneratedFiles.set(fileName, goInterface);
      }

      // Generate Go service interface and handlers for operations
      if (operations.size > 0) {
        const serviceInterface = this.generateGoServiceInterface(operations);
        const serviceFileName = "service.go";
        allGeneratedFiles.set(serviceFileName, serviceInterface);

        const httpHandlers = this.generateGoHttpHandlers(operations);
        const handlersFileName = "handlers.go";
        allGeneratedFiles.set(handlersFileName, httpHandlers);

        const routeRegistration = this.generateGoRouteRegistration(operations);
        const routesFileName = "routes.go";
        allGeneratedFiles.set(routesFileName, routeRegistration);
      }

      // Return successful result
      return ErrorFactory.createSuccess(allGeneratedFiles, {
        generatedFiles: Array.from(allGeneratedFiles.keys()),
      });
    } catch (error) {
      return ErrorFactory.createTypeSpecCompilerError(
        `Model generation failed: ${error instanceof Error ? error.message : String(error)}`,
        {
          resolution: "Check TypeSpec model definitions for syntax errors",
        },
      );
    }
  }

  /**
   * Generate Go struct from extracted model
   * DOMAIN LOGIC: Clean Go struct generation with proper types and composition
   */
  private generateGoStruct(
    modelName: string,
    extractedModel: { name: string; properties: ReadonlyMap<string, any>; extends?: string; propertiesFromExtends?: ReadonlyMap<string, any> },
  ): string {
    const imports = new Set<string>();
    const fields: string[] = [];
    const embeddedTypes = new Set<string>();

    // Process each property with domain intelligence
    for (const [propertyName, property] of extractedModel.properties) {
      const goType = GoTypeMapper.mapTypeSpecType(property.type, propertyName);
      const goTypeString = GoTypeMapper.generateGoTypeString(goType);
      const jsonTag = this.getJsonTag(propertyName);

      // Handle optional types with proper pointer semantics
      if (property.optional && goType.usePointerForOptional) {
        fields.push(
          `  ${this.capitalize(propertyName)} *${goTypeString} \`${jsonTag}\``,
        );
      } else {
        fields.push(
          `  ${this.capitalize(propertyName)} ${goTypeString} \`${jsonTag}\``,
        );
      }
    }

    // Handle extends with Go struct embedding
    if (extractedModel.extends) {
      embeddedTypes.add(extractedModel.extends);
      fields.push(`  ${this.capitalize(extractedModel.extends)} // Embedded struct`);
    }

    // Handle propertiesFromExtends (spread operator)
    if (extractedModel.propertiesFromExtends) {
      for (const [propertyName, property] of extractedModel.propertiesFromExtends) {
        const goType = GoTypeMapper.mapTypeSpecType(property.type, propertyName);
        const goTypeString = GoTypeMapper.generateGoTypeString(goType);
        const jsonTag = this.getJsonTag(propertyName);

        if (property.optional && goType.usePointerForOptional) {
          fields.push(
            `  ${this.capitalize(propertyName)} *${goTypeString} \`${jsonTag}\``,
          );
        } else {
          fields.push(
            `  ${this.capitalize(propertyName)} ${goTypeString} \`${jsonTag}\``,
          );
        }
      }
    }

    // Generate Go struct with imports
    const goStruct = [
      this.generateHeader(modelName),
      this.generateImports(imports),
      this.generateStructBody(modelName, fields),
      this.generateFooter(),
    ].join("\n");

    return goStruct;
  }

  /**
   * Generate Go union interface from extracted union
   * DOMAIN LOGIC: Clean sealed interface generation for unions
   */
  private generateGoUnionInterface(
    unionName: string,
    extractedUnion: { name: string; variants: ReadonlyMap<string, any> },
  ): string {
    const variantTypes: string[] = [];
    const implementationMethods: string[] = [];

    // Generate union interface and variants
    for (const [variantName, variant] of extractedUnion.variants) {
      const variantType = this.capitalize(variantName);
      variantTypes.push(variantType);
      
      // Generate isUnion method for each variant
      implementationMethods.push(`func (${variantType}) is${unionName}() {}`);
    }

    // Generate complete union interface
    const unionInterface = [
      this.generateHeader(unionName),
      this.generateUnionInterface(unionName, variantTypes),
      this.generateUnionImplementations(unionName, implementationMethods),
      this.generateFooter(),
    ].join("\n");

    return unionInterface;
  }

  /**
   * Generate union interface declaration
   */
  private generateUnionInterface(unionName: string, variantTypes: string[]): string {
    return `type ${unionName} interface {
  is${unionName}()
}`;
  }

  /**
   * Generate union implementations
   */
  private generateUnionImplementations(unionName: string, implementations: string[]): string {
    return [
      "// Union implementations",
      ...implementations,
    ].join("\n");
  }

  /**
   * Generate Go service interface from operations
   * DOMAIN LOGIC: Clean service interface with context.Context
   */
  private generateGoServiceInterface(
    operations: ReadonlyMap<string, any>,
  ): string {
    const methods: string[] = [];

    for (const [operationName, operation] of operations) {
      const goMethod = this.generateGoServiceMethod(operationName, operation);
      methods.push(goMethod);
    }

    const serviceInterface = [
      this.generateServiceHeader(),
      this.generateServiceInterfaceBody(methods),
      this.generateFooter(),
    ].join("\n");

    return serviceInterface;
  }

  /**
   * Generate individual service method
   */
  private generateGoServiceMethod(operationName: string, operation: any): string {
    const methodName = this.capitalize(operationName);
    const pathParams = this.extractPathParameters(operation.path);
    const queryParams = this.extractQueryParameters(operation);
    const bodyParams = this.extractBodyParameters(operation);
    
    // Build method signature
    const params = [
      "ctx context.Context",
      ...pathParams.map(p => `${p.name} string`),
      ...queryParams.map(q => `${q.name} string`),
      ...bodyParams.map(b => `${b.name} model`),
    ].join(", ");

    const returnType = operation.returnType 
      ? this.capitalize(operation.returnType.name || "Response")
      : "interface{}";

    return `  ${methodName}(${params}) (${returnType}, error)`;
  }

  /**
   * Generate HTTP handler functions for operations
   * DOMAIN LOGIC: Clean HTTP handlers with routing
   */
  private generateGoHttpHandlers(
    operations: ReadonlyMap<string, any>,
  ): string {
    const handlers: string[] = [];

    for (const [operationName, operation] of operations) {
      const handler = this.generateGoHttpHandler(operationName, operation);
      handlers.push(handler);
    }

    const httpHandlers = [
      this.generateHandlerHeader(),
      ...handlers,
      this.generateFooter(),
    ].join("\n");

    return httpHandlers;
  }

  /**
   * Generate individual HTTP handler
   */
  private generateGoHttpHandler(operationName: string, operation: any): string {
    const methodName = this.capitalize(operationName);
    const verb = operation.verb?.toUpperCase() || "GET";
    const path = operation.path || "/";
    const pathParams = this.extractPathParameters(operation.path);

    return `func handle${methodName}(
  service ${this.capitalize(operationName)}Service,
) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    // ${verb} ${path}
    ${pathParams.length > 0 ? this.generatePathExtraction(pathParams) : "// No path parameters"}
    
    resp, err := service.${operation.name}(${["ctx", ...pathParams.map(p => p.name)].join(", ")})
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(resp)
  }
}`;
  }

  /**
   * Generate route registration function
   */
  private generateGoRouteRegistration(
    operations: ReadonlyMap<string, any>,
  ): string {
    const routes: string[] = [];

    for (const [operationName, operation] of operations) {
      const verb = operation.verb?.toUpperCase() || "GET";
      const path = operation.path || "/";
      const methodName = this.capitalize(operationName);

      routes.push(`  router.HandleFunc("${verb}", "${path}", handle${methodName}(service))`);
    }

    const routeRegistration = [
      this.generateRouteHeader(),
      this.generateRouteBody(routes),
      this.generateFooter(),
    ].join("\n");

    return routeRegistration;
  }

  /**
   * Helper: Extract path parameters from route path
   */
  private extractPathParameters(path: string): Array<{name: string, type: string}> {
    const paramRegex = /\{(\w+)\}/g;
    const params: Array<{name: string, type: string}> = [];
    let match;

    while ((match = paramRegex.exec(path)) !== null) {
      params.push({ name: match[1]!, type: "string" });
    }

    return params;
  }

  /**
   * Helper: Extract body parameters from operation
   */
  private extractBodyParameters(operation: any): Array<{name: string, type: string}> {
    const bodyParams: Array<{name: string, type: string}> = [];
    
    if (operation.parameters) {
      // Handle both Array and Map types
      const paramList = Array.isArray(operation.parameters) 
        ? operation.parameters 
        : Array.from(operation.parameters.values());

      for (const param of paramList) {
        if (param.location === "body") {
          bodyParams.push({ name: param.name, type: "model" });
        }
      }
    }

    return bodyParams;
  }

  /**
   * Helper: Extract query parameters from operation
   */
  private extractQueryParameters(operation: any): Array<{name: string, type: string}> {
    const queryParams: Array<{name: string, type: string}> = [];
    
    if (operation.parameters) {
      for (const param of operation.parameters) {
        if (param.location === "query") {
          queryParams.push({ name: param.name, type: "string" });
        }
      }
    }

    return queryParams;
  }

  /**
   * Helper: Generate path parameter extraction
   */
  private generatePathExtraction(pathParams: Array<{name: string, type: string}>): string {
    const extractions: string[] = [];
    
    pathParams.forEach((param, index) => {
      const varName = param.name;
      extractions.push(`    ${varName} := mux.Vars(r)["${param.name}"]`);
    });

    return extractions.join("\n");
  }

  /**
   * Generate service file header
   */
  private generateServiceHeader(): string {
    return `// Auto-generated TypeSpec service interface
// Generated by Type-safe Professional Go Emitter
package api

import "context"
`;
  }

  /**
   * Generate service interface body
   */
  private generateServiceInterfaceBody(methods: string[]): string {
    return `type ApiService interface {
${methods.join("\n")}
}`;
  }

  /**
   * Generate handler file header
   */
  private generateHandlerHeader(): string {
    return `// Auto-generated HTTP handlers for TypeSpec operations
// Generated by Type-safe Professional Go Emitter
package api

import (
  "context"
  "encoding/json"
  "net/http"
  "github.com/gorilla/mux"
)
`;
  }

  /**
   * Generate route file header
   */
  private generateRouteHeader(): string {
    return `// Auto-generated route registration for TypeSpec operations
// Generated by Type-safe Professional Go Emitter
package api

import (
  "net/http"
  "github.com/gorilla/mux"
)
`;
  }

  /**
   * Generate route body
   */
  private generateRouteBody(routes: string[]): string {
    return `func RegisterRoutes(router *http.ServeMux, service ApiService) {
${routes.join("\n")}
}`;
  }

  /**
   * Generate Go file header
   * DOMAIN LOGIC: Professional Go file header
   */
  private generateHeader(modelName: string): string {
    return `// Auto-generated from TypeSpec model: ${modelName}
// Generated by Type-safe Professional Go Emitter
package api

`;
  }

  /**
   * Generate Go imports
   * DOMAIN LOGIC: Clean imports management
   */
  private generateImports(imports: Set<string>): string {
    if (imports.size === 0) {
      return "";
    }

    const importStatements = Array.from(imports)
      .sort()
      .map((imp) => `import "${imp}"`);

    return "\n" + importStatements.join("\n") + "\n\n";
  }

  /**
   * Generate Go struct body
   * DOMAIN LOGIC: Clean Go struct generation
   */
  private generateStructBody(modelName: string, fields: string[]): string {
    if (fields.length === 0) {
      return `type ${modelName} struct {}`;
    }

    return `type ${modelName} struct {\n${fields.join("\n")}\n}`;
  }

  /**
   * Generate Go file footer
   * DOMAIN LOGIC: Clean Go file footer
   */
  private generateFooter(): string {
    return "\n";
  }

  /**
   * Get Go file name from model name
   * DOMAIN LOGIC: Proper Go file naming
   */
  private getFileName(modelName: string): string {
    return `${this.capitalize(modelName)}.go`;
  }

  /**
   * Get JSON tag for property
   * DOMAIN LOGIC: Proper JSON tag generation
   */
  private getJsonTag(propertyName: string): string {
    const snakeCase = propertyName
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toLowerCase();

    const tagName = propertyName === snakeCase ? propertyName : snakeCase;
    return `${tagName}${propertyName === "id" ? ",omitempty" : ",omitempty"}`;
  }

  /**
   * Capitalize first letter (PascalCase)
   * DOMAIN LOGIC: Proper Go naming conventions
   */
  private capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
