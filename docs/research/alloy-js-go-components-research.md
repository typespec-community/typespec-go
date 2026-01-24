# 🔍 ALLOY-JS GO COMPONENTS RESEARCH SUMMARY

## Key Findings

### ✅ Available Components (Actual Exports)

```typescript
// CORRECT imports - these actually exist
import {
  SourceFile, // ✅ File container
  ImportStatement, // ✅ Import management
  SingleImportStatement, // ✅ Single import
  FunctionDeclaration, // ✅ Function/method generation
  FunctionReceiver, // ✅ Method receivers
  TypeDeclaration, // ✅ Named type declarations
  StructDeclaration, // ✅ Anonymous structs
  StructTypeDeclaration, // ✅ Named structs
  StructMember, // ✅ Struct fields
  StructEmbed, // ✅ Struct embedding
  VariableDeclaration, // ✅ Variable declarations
  VariableDeclarationGroup, // ✅ Variable groups
  InterfaceDeclaration, // ✅ Interface types
  ModuleDirectory, // ✅ Directory structure
  SourceDirectory, // ✅ Source directory
  Name, // ✅ Name resolution
  Reference, // ✅ Type references
} from "@alloy-js/go";
```

### ❌ Non-Existent Components (Documentation Mismatch)

```typescript
// ❌ These components DON'T exist - causes import errors
import {
  Package, // ❌ Use ModuleDirectory instead
  Import, // ❌ Use ImportStatement instead
  VarDeclaration, // ❌ Use VariableDeclaration instead
} from "@alloy-js/go";
```

## Correct Usage Patterns

### 1. Package Structure

```typescript
// ❌ WRONG - Package doesn't exist
<Package name="api">
  {/* ... */}
</Package>

// ✅ CORRECT - Use ModuleDirectory
<ModuleDirectory name="api">
  {/* ... */}
</ModuleDirectory>
```

### 2. Import Management

```typescript
// ❌ WRONG - Import doesn't exist
<Import path="encoding/json" />

// ✅ CORRECT - Use ImportStatement
<ImportStatement path="encoding/json" />

// Or for single imports
<SingleImportStatement path="encoding/json" />
```

### 3. Variable Declarations

```typescript
// ❌ WRONG - VarDeclaration doesn't exist
<VarDeclaration name="service" type="*Service" />

// ✅ CORRECT - Use VariableDeclaration
<VariableDeclaration name="service" type="*Service" />

// Or for grouped variables
<VariableDeclarationGroup>
  <VariableDeclaration name="service" type="*Service" />
  <VariableDeclaration name="logger" type="*log.Logger" />
</VariableDeclarationGroup>
```

### 4. Function Declarations

```typescript
// ✅ CORRECT - FunctionDeclaration with receiver
<FunctionDeclaration name="RegisterRoutes" receiver={<FunctionReceiver name="s" type="*Service" />}>
  {/* function body */}
</FunctionDeclaration>

// ✅ CORRECT - Regular function
<FunctionDeclaration name="NewService" parameters={[...]}>
  {/* function body */}
</FunctionDeclaration>
```

### 5. Struct Declarations

```typescript
// ✅ CORRECT - Named struct
<StructTypeDeclaration name="User">
  <StructMember name="ID" type="string" tag={{json: "id"}} />
  <StructMember name="Name" type="*string" tag={{json: "name,omitempty"}} />
</StructTypeDeclaration>

// ✅ CORRECT - Anonymous struct
<StructDeclaration>
  <StructMember name="Field" type="string" />
</StructDeclaration>
```

## File Organization

### Complete File Structure

```typescript
<SourceFile path="service.go">
  {/* Import statements */}
  <ImportStatement path="context" />
  <ImportStatement path="encoding/json" />
  <ImportStatement path="net/http" />

  {/* Type declarations */}
  <StructTypeDeclaration name="Service">
    <StructMember name="logger" type="*log.Logger" />
  </StructTypeDeclaration>

  {/* Function declarations */}
  <FunctionDeclaration name="NewService" parameters={[...]}>
    {/* implementation */}
  </FunctionDeclaration>

  <FunctionDeclaration name="RegisterRoutes" receiver={<FunctionReceiver name="s" type="*Service" />}>
    {/* implementation */}
  </FunctionDeclaration>
</SourceFile>
```

## Key Insights

### 1. Import System

- **Automatic Import Management**: Use `<Reference refkey={refkey} />` for type references
- **Manual Imports**: Use `<ImportStatement path="package/path" />` for standard library
- **Import Organization**: Alloy automatically groups imports (stdlib, third-party, local)

### 2. Type References

```typescript
// ✅ Automatic import + type reference
<Reference refkey={refkey(modelType)} />

// ✅ Built-in types (no import needed)
<string />
<bool />
<int />
```

### 3. Component Architecture

- **All components are functional components** following JSX patterns
- **Use refkey for TypeSpec object references**
- **Use For for iteration**: `<For each={items} to={(item) => <Component item={item} />} />`

### 4. File Generation

```typescript
// ✅ Single file with all declarations
<SourceFile path="handlers.go">
  {/* All Go code goes here */}
</SourceFile>
```

## Next Steps

1. **Update GoHandlerStub.tsx** to use correct component names
2. **Replace all string templates** with proper Alloy components
3. **Use ImportStatement instead of manual imports**
4. **Use FunctionDeclaration for methods**
5. **Use VariableDeclaration for variables**

This research shows that Alloy-JS Go components ARE available and functional - we just need to use the correct component names and patterns.
