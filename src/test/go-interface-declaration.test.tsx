import { describe, test, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceFile } from "@alloy-js/go";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import { GoInterfaceDeclarationMinimal } from "./GoInterfaceDeclarationMinimal.js";
import {
  GoInterfaceDeclaration,
  collectOperations,
} from "../components/go/GoInterfaceDeclaration.js";
import { MockFactory } from "../testing/mock-factory.js";

describe("GoInterfaceDeclaration Component", () => {
  test("minimal interface component renders", () => {
    const output = render(
      <Output>
        <ModuleDirectory name="test">
          <SourceDirectory path="test">
            <SourceFile path="test.go" package="test">
              <GoInterfaceDeclarationMinimal />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    // Get the test.go file content
    const moduleDir = output.contents[0] as any;
    const sourceDir = moduleDir.contents[0] as any;
    const sourceFile = sourceDir.contents[0] as any;
    const fileContent = sourceFile.contents;

    expect(fileContent).toContain("type TestService interface");
    expect(fileContent).toContain("GetUser(ctx context.Context, id string) (User, error)");
  });

  test("generates interface from operations", () => {
    const mockOperation = MockFactory.createOperation("getUser", {
      returnType: MockFactory.createModel("User"),
      parameters: {
        id: MockFactory.createScalar("string"),
      },
    });

    const output = render(
      <Output>
        <GoPackageDirectory 
          operations={[mockOperation]}
          packageName="test"
          modulePath="github.com/test/test"
        />
      </Output>,
    );

    // Navigate the structure to get the interfaces.go content
    const moduleDir = output.contents[0] as any;
    const sourceDir = moduleDir.contents[0] as any;
    
    // Find the interfaces.go file
    const interfacesFile = sourceDir.contents.find((file: any) => 
      file.path === "interfaces.go"
    ) as any;
    
    expect(interfacesFile.contents).toContain("type TestService interface");
    expect(interfacesFile.contents).toContain("GetUser(ctx context.Context, id string) (User, error)");
  });

  test("handles operations with no return type", () => {
    const mockOperation = MockFactory.createOperation("deleteUser", {
      parameters: {
        id: MockFactory.createScalar("string"),
      },
    });

    const output = render(
      <Output>
        <ModuleDirectory name="test">
          <SourceFile path="interfaces.go" package="test">
            <GoInterfaceDeclaration
              name="UserService"
              operations={[mockOperation]}
              packageName="test"
            />
          </SourceFile>
        </ModuleDirectory>
      </Output>,
    );

    // Get the interfaces.go file content
    const moduleDir = output.contents[0] as any;
    const sourceFile = moduleDir.contents[0] as any;
    const fileContent = sourceFile.contents;

    expect(fileContent).toContain("DeleteUser(ctx context.Context, id string) error");
  });

  test("collects operations from namespace", () => {
    const mockNamespace = MockFactory.createNamespace("TestAPI", {
      operations: {
        getUser: MockFactory.createOperation("getUser"),
        createUser: MockFactory.createOperation("createUser"),
      },
    });

    const operations = collectOperations(mockNamespace);

    expect(operations).toHaveLength(2);
    expect(operations[0].name).toBe("getUser");
    expect(operations[1].name).toBe("createUser");
  });
});
