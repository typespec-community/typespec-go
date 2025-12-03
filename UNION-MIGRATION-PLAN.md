# Union Generator Migration Plan: String-Based to Alloy/Go Implementation

## 📋 OVERVIEW

Replace the string-based `union-generator.ts` with a modern Alloy/Go implementation while maintaining full backward compatibility and test coverage.

**Current State Analysis:**
- `union-generator.ts`: 247 lines of string-based generation logic
- `GoUnionDeclaration.tsx`: 152 lines of Alloy component (already exists)
- `standalone-generator.ts`: Uses UnionGenerator class
- Tests: 6 union-related tests that must continue passing

## 🎯 MIGRATION STRATEGY

1. **Preserve existing API** - Keep `StandaloneGoGenerator.generateUnionType()` signature
2. **Replace internal implementation** - Use Alloy/Go component instead of string generation
3. **Maintain error handling** - Keep unified error system integration
4. **Ensure test compatibility** - All existing tests must pass
5. **Add type safety** - Eliminate any remaining type safety issues

## 📊 TASK BREAKDOWN (Sorted by Impact/Effort)

### Phase 1: Preparation & Analysis (12 min each)

#### Task 1: Analyze Current Implementation (Priority: CRITICAL)
- **Effort**: 10 min
- **Impact**: High - Foundation for migration
- **Details**: Map current UnionGenerator API to GoUnionDeclaration capabilities
- **Output**: Compatibility matrix showing what needs adaptation

#### Task 2: Create Alloy Union Integration Layer (Priority: CRITICAL) 
- **Effort**: 12 min
- **Impact**: High - Core integration point
- **Details**: Create `AlloyUnionGenerator` that wraps GoUnionDeclaration
- **Output**: New file with Alloy integration and error handling

#### Task 3: Map Type System Interfaces (Priority: HIGH)
- **Effort**: 8 min
- **Impact**: High - Type compatibility
- **Details**: Ensure TypeSpec types map correctly to Alloy GoUnionDeclaration
- **Output**: Type mapping functions and utilities

### Phase 2: Implementation & Integration (12 min each)

#### Task 4: Implement Alloy Union Generator Core (Priority: CRITICAL)
- **Effort**: 12 min
- **Impact**: Critical - Main implementation
- **Details**: Replace string-based generation with Alloy component calls
- **Output**: Working AlloyUnionGenerator class

#### Task 5: Integrate Discriminated Union Support (Priority: HIGH)
- **Effort**: 10 min
- **Impact**: High - Complex union type support
- **Details**: Map discriminator field logic to Alloy implementation
- **Output**: Discriminated unions working correctly

#### Task 6: Handle Recursive Union Patterns (Priority: HIGH)
- **Effort**: 10 min
- **Impact**: High - Advanced patterns
- **Details**: Map recursive variant detection to Alloy patterns
- **Output**: Recursive unions generating proper Go code

### Phase 3: Testing & Validation (12 min each)

#### Task 7: Update Standalone Generator Integration (Priority: CRITICAL)
- **Effort**: 8 min
- **Impact**: Critical - Integration point
- **Details**: Update StandaloneGoGenerator to use new AlloyUnionGenerator
- **Output**: StandaloneGoGenerator using Alloy implementation

#### Task 8: Verify All Union Tests Pass (Priority: CRITICAL)
- **Effort**: 10 min
- **Impact**: Critical - Test compatibility
- **Details**: Run union-type-generation.test.ts and enum-union-integration.test.ts
- **Output**: All tests passing with new implementation

#### Task 9: Performance Validation (Priority: MEDIUM)
- **Effort**: 8 min
- **Impact**: Medium - Performance verification
- **Details**: Ensure sub-millisecond generation performance is maintained
- **Output**: Performance metrics within acceptable range

### Phase 4: Cleanup & Documentation (12 min each)

#### Task 10: Deprecate Old Union Generator (Priority: MEDIUM)
- **Effort**: 8 min
- **Impact**: Medium - Code cleanup
- **Details**: Add deprecation warnings and migration comments
- **Output**: Clear deprecation path for old implementation

#### Task 11: Update Imports & References (Priority: MEDIUM)
- **Effort**: 6 min
- **Impact**: Medium - Code consistency
- **Details**: Update all imports to use new AlloyUnionGenerator
- **Output**: Consistent import structure

#### Task 12: Documentation Update (Priority: LOW)
- **Effort**: 10 min
- **Impact**: Low - Documentation
- **Details**: Update inline documentation for new implementation
- **Output**: Comprehensive documentation

## 🏗️ TECHNICAL DESIGN

### New Architecture
```
StandaloneGoGenerator
    ↓ (uses)
AlloyUnionGenerator (NEW)
    ↓ (wraps)
GoUnionDeclaration (EXISTING Alloy component)
    ↓ (generates)
Go code with proper imports and formatting
```

### Key Integration Points
1. **Error Handling**: Wrap Alloy output in unified error system
2. **Type Mapping**: Convert TypeSpec types to Alloy-compatible format
3. **File Output**: Map Alloy render output to GoEmitterResult format
4. **Discriminator Logic**: Preserve discriminated union functionality

### Type Compatibility
```typescript
// Current UnionGenerator input
{
  name: string;
  kind: "union";
  variants: Array<{ name: string; type: TypeSpecTypeNode }>;
  discriminator?: string;
}

// GoUnionDeclaration input (needs adapter)
{
  union: Union; // TypeSpec Union type
  discriminator?: string;
  program?: Program;
}
```

## 📈 SUCCESS METRICS

### Functional Requirements
- [ ] All 6 union tests passing
- [ ] Backward compatibility maintained
- [ ] Error handling system integration
- [ ] Discriminated unions working
- [ ] Recursive unions working

### Performance Requirements
- [ ] <1ms generation for simple unions
- [ ] <5ms for complex discriminated unions
- [ ] Memory usage stable

### Code Quality Requirements
- [ ] Zero any types
- [ ] TypeScript strict compliance
- [ ] Comprehensive documentation
- [ ] No deprecated patterns

## 🎯 EXECUTION ORDER

1. **Analyze** → Understand current implementation
2. **Create** → Build integration layer
3. **Map** → Ensure type compatibility
4. **Implement** → Core functionality
5. **Integrate** → Complex patterns
6. **Update** → Standalone generator
7. **Verify** → Test compatibility
8. **Validate** → Performance check
9. **Cleanup** → Remove old code
10. **Document** → Update documentation

## 🚨 CRITICAL SUCCESS FACTORS

1. **Test Continuity**: All existing tests must pass without modification
2. **API Compatibility**: StandaloneGoGenerator interface unchanged
3. **Error Handling**: Unified error system integration required
4. **Performance**: No regression in generation speed
5. **Type Safety**: Zero any types throughout implementation

---

*Plan created: 2025-12-04*
*Estimated total effort: 2 hours 4 minutes*
*Priority focus: Tasks 1-8 (critical path)*