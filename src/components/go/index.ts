/**
 * Go Components Barrel Export
 * 
 * Centralized exports for all TypeSpec Go emitter components
 * Provides clean import paths for the Alloy-JS based Go code generation system
 */

// Core Go generation components
export { GoStructDeclaration } from './GoStructDeclaration.js'
export { GoEnumDeclaration } from './GoEnumDeclaration.js'
export { GoUnionDeclaration } from './GoUnionDeclaration.js'
export { GoInterfaceDeclaration } from './GoInterfaceDeclaration.js'
export { GoHandlerMethodComponent } from './GoHandlerMethodComponent.js'
export { GoRouteRegistrationComponent } from './GoRouteRegistrationComponent.js'
export { GoHandlerStub } from './GoHandlerStub.js'

// Go code generation utilities
export { GoModFile } from './GoModFile.js'

// Type system components
export { TypeConstraint, GenericParameter, extractTemplateParameters, extractTemplateConstraints } from '../TypeConstraint.js'

// Re-export commonly used Alloy-JS Go components
export { 
  TypeDeclaration, 
  StructDeclaration, 
  StructMember, 
  InterfaceDeclaration, 
  FunctionDeclaration, 
  FunctionReceiver,
  TypeParameter,
  SourceFile,
  Reference
} from '@alloy-js/go'

// Re-export commonly used Alloy-JS core components  
export { For, refkey } from '@alloy-js/core'