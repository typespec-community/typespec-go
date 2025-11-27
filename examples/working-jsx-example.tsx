#!/usr/bin/env bun

/**
 * REAL ALLOY.JS JSX → GO CODE GENERATION EXAMPLE
 * This is a working example, not fake TypeScript interfaces
 */

import { render, Output } from "@alloy-js/core";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

// Real JSX component that generates actual Go code
function generateUserStruct() {
  const goOutput = render(
    <Output>
      <SourceFile path="models/user.go">
        <StructTypeDeclaration name="User">
          <StructMember exported name="ID" type="string" tag={{ json: "id" }} />
          <StructMember exported name="Name" type="string" tag={{ json: "name" }} />
          <StructMember exported name="Email" type="string" tag={{ json: "email" }} />
          <StructMember exported name="Age" type="int" tag={{ json: "age,omitempty" }} />
          <StructMember exported name="Active" type="bool" tag={{ json: "active" }} />
          <StructMember name="Profile" type="*Profile" tag={{ json: "profile,omitempty" }} />
        </StructTypeDeclaration>

        <StructTypeDeclaration name="Profile">
          <StructMember exported name="Bio" type="string" tag={{ json: "bio" }} />
          <StructMember exported name="Avatar" type="string" tag={{ json: "avatar,omitempty" }} />
        </StructTypeDeclaration>
      </SourceFile>
    </Output>,
  );

  return goOutput;
}

// Execute JSX generation
console.log("=== REAL JSX → Go Code Generation ===");
const result = generateUserStruct();
console.log(result);
console.log("=== Generation Complete ===");

export { generateUserStruct };
