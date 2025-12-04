/**
 * Go Interface Declaration Component - Minimal Working Version
 * Generates Go interfaces from TypeSpec operations using Alloy-JS components
 */

import * as go from "@alloy-js/go";
const { InterfaceDeclaration, InterfaceFunction } = go;

/**
 * Minimal Go Interface Declaration Component
 * Hardcoded version for testing component structure
 */
export function GoInterfaceDeclarationMinimal() {
  return (
    <go.TypeDeclaration name="TestService" doc="Test service interface">
      <InterfaceDeclaration>
        <InterfaceFunction 
          name="GetUser"
          parameters={[{ name: "ctx", type: "context.Context" }, { name: "id", type: "string" }]}
          returns="(User, error)"
          doc="Get user by ID"
        />
      </InterfaceDeclaration>
    </go.TypeDeclaration>
  );
}