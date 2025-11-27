#!/usr/bin/env bun

/**
 * REAL ALLOY.JS JSX → GO CODE GENERATION EXAMPLE
 * Working example with proper Go scope
 */

import { render, Output, createGoScope } from "@alloy-js/core";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

// Working example with proper Go scope
function generateWorkingStruct() {
  // Create Go scope first
  const goScope = createGoScope();

  const userStruct = StructTypeDeclaration({
    name: "User",
    children: [
      StructMember({
        exported: true,
        name: "ID",
        type: "string",
        tag: { json: "id" },
      }),
      StructMember({
        exported: true,
        name: "Name",
        type: "string",
        tag: { json: "name" },
      }),
      StructMember({
        exported: true,
        name: "Email",
        type: "string",
        tag: { json: "email" },
      }),
    ],
  });

  const goFile = SourceFile({
    path: "models/user.go",
    children: [userStruct],
  });

  const goOutput = render([goFile]);
  return goOutput;
}

// Execute JSX generation
console.log("=== REAL JSX → Go Code Generation ===");
const result = generateWorkingStruct();
console.log(result);
console.log("=== Generation Complete ===");

export { generateWorkingStruct };
