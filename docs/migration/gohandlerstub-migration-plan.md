# 🎯 ALLOY-JS MIGRATION PLAN: GoHandlerStub.tsx

## Current Issues
- Using string templates instead of Alloy components
- Manual import generation instead of ImportStatement
- Non-existent component imports causing errors
- Mixed approach (SourceFile + strings) instead of pure component architecture

## Migration Steps

### Step 1: Fix Import Statements
```typescript
// ❌ CURRENT - Broken imports
import { Package, Import, VarDeclaration } from "@alloy-js/go";

// ✅ FIXED - Use actual available components
import {
  SourceFile,
  ImportStatement,
  FunctionDeclaration,
  FunctionReceiver,
  VariableDeclaration,
  VariableDeclarationGroup,
  StructTypeDeclaration,
  StructMember,
  Reference
} from "@alloy-js/go";
```

### Step 2: Replace String Imports with ImportStatement
```typescript
// ❌ CURRENT - String template imports
`import (
	"context"
	"encoding/json"
	"net/http"
	"log"
)`

// ✅ FIXED - Component-based imports
<>
  <ImportStatement path="context" />
  <ImportStatement path="encoding/json" />
  <ImportStatement path="net/http" />
  <ImportStatement path="log" />
</>
```

### Step 3: Replace Struct Generation
```typescript
// ❌ CURRENT - String template struct
`type ${serviceName} struct {
	logger *log.Logger
}`

// ✅ FIXED - Component-based struct
<StructTypeDeclaration name={serviceName}>
  <StructMember name="logger" type="*log.Logger" />
</StructTypeDeclaration>
```

### Step 4: Replace Handler Functions
```typescript
// ❌ CURRENT - String template function
`func (s *${serviceName}) ${handler.name}(...) {
	// implementation
}`

// ✅ FIXED - Component-based function
<FunctionDeclaration 
  name={handler.name}
  receiver={<FunctionReceiver name="s" type="*Service" />}
>
  {/* implementation */}
</FunctionDeclaration>
```

### Step 5: Replace Constructor Function
```typescript
// ❌ CURRENT - String template
`func New${serviceName}(logger *log.Logger) *${serviceName} {
	${serviceName.toLowerCase()} := &${serviceName}{
		logger: logger,
	}
	return ${serviceName.toLowerCase()}
}`

// ✅ FIXED - Component-based
<FunctionDeclaration 
  name={`New${serviceName}`}
  parameters={[
    { name: "logger", type: "*log.Logger" }
  ]}
  returns={`*${serviceName}`}
>
  <VariableDeclaration name={serviceName.toLowerCase()} type={`*${serviceName}`}>
    {`&${serviceName}{`}</VariableDeclaration>
  {/* Need to figure out struct literal syntax */}
</FunctionDeclaration>
```

## Priority Implementation Order

1. **Fix imports** - Use correct component names
2. **Replace package declaration** - Remove manual package line
3. **Replace import block** - Use ImportStatement components  
4. **Replace service struct** - Use StructTypeDeclaration
5. **Replace handler methods** - Use FunctionDeclaration with receivers
6. **Replace constructor** - Use FunctionDeclaration with proper parameters

## Expected Outcome

- 100% component-based architecture
- Zero string templates
- Automatic import management by Alloy
- Type-safe generation with refkey support
- Proper JSX syntax with correct component names