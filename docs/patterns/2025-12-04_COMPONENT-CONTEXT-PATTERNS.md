# Alloy-JS Component Context Patterns - Quick Reference

## ✅ WORKING PATTERNS (Verified 2025-12-04)

### **Component Context Hierarchy:**

```
<Output>
  <ModuleDirectory name="github.com/test/test">
    <SourceDirectory path="test">
      <SourceFile path="file.go" package="test">
        <YourComponent />
      </SourceFile>
    </SourceDirectory>
  </ModuleDirectory>
</Output>
```

### **Key Context Requirements:**

1. **ModuleDirectory:** Provides module scope and Go context
2. **SourceDirectory:** Provides package directory structure
3. **SourceFile:** Provides package scope for Go components
4. **Package Prop:** Required for SourceFile (`package="test"`)

### **Required Imports:**

```typescript
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
```

### **Output Structure Navigation:**

```typescript
const moduleDir = output.contents[0]; // ModuleDirectory
const sourceDir = moduleDir.contents[0]; // SourceDirectory
const sourceFile = sourceDir.contents[0]; // SourceFile
const fileContent = sourceFile.contents; // Generated Go code
```

## ❌ COMMON MISTAKES TO AVOID:

1. **Missing SourceDirectory:** Causes "Package not in scope"
2. **Wrong file path structure:** Files appear in `test/file.go` not `file.go`
3. **Missing package prop:** SourceFile requires `package="test"`
4. **Incorrect ModuleDirectory name:** Should be full module path

## 🎯 ALWAYS USE THIS PATTERN:

For testing any Alloy-JS Go component, use the exact hierarchy above.
This pattern has been verified with 137/137 passing tests.

## 📊 Context Flow:

ModuleDirectory → GoModuleScope → SourceDirectory → SourceFile → GoPackageScope → Component

## ✅ VERIFIED COMPONENTS:

- GoInterfaceDeclarationMinimal ✅
- GoPackageDirectory ✅
- All GoEnum/GoUnion/GoModel ✅
- 137/137 tests passing ✅
