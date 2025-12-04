/**
 * Go Components Index
 * Central export point for all Go generation components
 * Provides clean API for consuming components
 */

// Core Go generation components
export { GoModFile } from './GoModFile.js';
export { GoStructDeclaration } from './GoStructDeclaration.js';
export { GoEnumDeclaration } from './GoEnumDeclaration.js';
export { GoUnionDeclaration } from './GoUnionDeclaration.js';
export { GoInterfaceDeclaration } from './GoInterfaceDeclaration.js';
export { GoHandlerStub } from './GoHandlerStub.js';
export { GoPackageDirectory } from './GoPackageDirectory.js';

// Re-export commonly used Alloy-JS utilities
export { refkey, Reference, For } from '@alloy-js/core';
export { 
  StructDeclaration, 
  StructMember, 
  TypeDeclaration,
  FunctionDeclaration,
  FunctionReceiver,
  SourceFile,
  ModuleDirectory,
  SourceDirectory,
  VariableDeclaration,
  AppendFile
} from '@alloy-js/go';

// Type re-exports for convenience
export type { GoModFileProps } from './GoModFile.js';
export type { GoStructDeclarationProps } from './GoStructDeclaration.js';
export type { GoEnumDeclarationProps } from './GoEnumDeclaration.js';
export type { GoUnionDeclarationProps } from './GoUnionDeclaration.js';
export type { GoInterfaceDeclarationProps } from './GoInterfaceDeclaration.js';
export type { GoHandlerStubProps } from './GoHandlerStub.js';
export type { GoPackageDirectoryProps } from './GoPackageDirectory.js';