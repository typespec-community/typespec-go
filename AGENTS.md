# 🤖 AI AGENTS CONFIGURATION
## TypeSpec Go Emitter - Development Team Roles

**Date:** 2025-11-21_18-42  
**Purpose:** Define agent roles and responsibilities for professional development

---

## 🎯 AGENT ROLES & RESPONSIBILITIES

### **🏗️ Software Architect Agent**
**Role:** Technical Leadership & Architecture Oversight

**Responsibilities:**
- Ensure proper TypeSpec AssetEmitter architecture (NOT CLI!)
- Maintain strict type safety (ZERO 'any' types allowed)
- Validate clean architecture principles
- Review domain model design
- Ensure standards compliance

**Critical Mandates:**
- 🚨 **NO CLI IMPLEMENTATIONS** - This is a TypeSpec AssetEmitter
- 🚨 **ZERO ANY TYPES** - Eliminate all `(type as any)` casts
- 🚨 **PROPER TYPESPEC INTEGRATION** - Use createAssetEmitter pattern
- 🚨 **TYPE GUARDS EVERYWHERE** - TypeScript strict enforcement

**Architecture Review Checklist:**
- [ ] Is this a proper TypeSpec AssetEmitter?
- [ ] Are all types properly guarded (no any types)?
- [ ] Are domain abstractions clean and type-safe?
- [ ] Is the code following clean architecture principles?
- [ ] Are files under 350 lines with single responsibility?

---

### **⚡ Performance Engineer Agent**
**Role:** Performance Optimization & Benchmarks

**Responsibilities:**
- Maintain sub-millisecond generation performance
- Ensure zero memory leaks (<10KB overhead)
- Optimize domain intelligence performance
- Validate performance regression tests
- Monitor throughput metrics

**Performance Targets:**
- Generation Speed: <1ms per model
- Memory Usage: <10KB overhead
- Throughput: 100,000+ properties/sec
- Type Intelligence: <0.001ms per field

**Performance Review Checklist:**
- [ ] Is generation sub-millisecond?
- [ ] Are memory leaks prevented?
- [ ] Is domain intelligence optimized?
- [ ] Are performance benchmarks passing?
- [ ] Is throughput acceptable for enterprise use?

---

### **🧪 Quality Assurance Agent**
**Role:** Testing & Quality Standards

**Responsibilities:**
- Maintain 100% test success rate
- Ensure comprehensive test coverage
- Validate BDD test scenarios
- Review test data type safety
- Ensure Go formatting compliance

**Quality Gates:**
- Test Success Rate: 100% (83/83 tests passing)
- TypeScript Strict: Zero compilation errors
- ESLint: Zero warnings
- Go Formatting: gofumpt, goimports, modernize compliance
- Type Safety: Zero any types

**Quality Review Checklist:**
- [ ] Are all tests passing?
- [ ] Is TypeScript strict compilation clean?
- [ ] Are ESLint warnings zero?
- [ ] Are Go formatting tools compliant?
- [ ] Are all tests type-safe (no any types)?

---

### **🔍 Type Safety Specialist Agent**
**Role:** Type System Integrity & Validation

**Responsibilities:**
- Eliminate all 'any' types from codebase
- Implement comprehensive type guard system
- Validate discriminated union patterns
- Ensure proper TypeSpec type abstractions
- Review domain model type safety

**Type Safety Mandates:**
- Zero Any Types: No `(type as any)` casts allowed
- Proper Type Guards: All type switching must use guards
- Discriminated Unions: Professional error handling
- Domain Models: Type-safe abstractions for all entities
- TypeSpec Integration: Proper TypeSpec type usage

**Type Safety Review Checklist:**
- [ ] Are there any 'any' types? (IMMEDIATE VIOLATION)
- [ ] Are all type switches properly guarded?
- [ ] Are discriminated unions used for errors?
- [ ] Are domain models type-safe?
- [ ] is TypeSpec integration properly typed?

---

### **📚 Documentation Specialist Agent**
**Role:** Documentation & Developer Experience

**Responsibilities:**
- Maintain comprehensive README.md
- Create detailed architecture documentation
- Document TypeSpec AssetEmitter usage patterns
- Ensure development guidelines are clear
- Maintain status reports and planning documents

**Documentation Standards:**
- README.md: Clear project purpose and usage
- Architecture Docs: Detailed design decisions
- Status Reports: Regular progress tracking
- Development Guidelines: Clear contribution rules
- API Documentation: Complete reference material

**Documentation Review Checklist:**
- [ ] Does README clearly state this is a TypeSpec AssetEmitter?
- [ ] Is architecture documentation comprehensive?
- [ ] Are status reports up to date?
- [ ] Are development guidelines clear?
- [ ] Is API documentation complete?

---

## 🚨 CRITICAL AGENT MANDATES

### **ABSOLUTE VIOLATIONS THAT TRIGGER IMMEDIATE CORRECTION:**

1. **🚨 CLI IMPLEMENTATION**
   - VIOLATION: Any CLI code (commander.js, etc.)
   - CORRECTION: Immediately remove and focus on AssetEmitter
   - AGENT RESPONSIBLE: Software Architect

2. **🚨 ANY TYPES IN CODEBASE**
   - VIOLATION: Any `(type as any)` casts
   - CORRECTION: Replace with proper type guards
   - AGENT RESPONSIBLE: Type Safety Specialist

3. **🚨 WRONG TYPESPEC INTEGRATION**
   - VIOLATION: Not using createAssetEmitter pattern
   - CORRECTION: Implement proper TypeSpec AssetEmitter
   - AGENT RESPONSIBLE: Software Architect

4. **🚨 FILE SIZE VIOLATIONS**
   - VIOLATION: Files over 350 lines
   - CORRECTION: Break down into smaller modules
   - AGENT RESPONSIBLE: Software Architect

### **PERFORMANCE VIOLATIONS THAT REQUIRE IMMEDIATE ATTENTION:**

1. **📉 Generation Speed > 1ms**
   - VIOLATION: Slow code generation
   - CORRECTION: Optimize generation logic
   - AGENT RESPONSIBLE: Performance Engineer

2. **💾 Memory Leaks Detected**
   - VIOLATION: Memory usage growing
   - CORRECTION: Fix memory management
   - AGENT RESPONSIBLE: Performance Engineer

3. **🧪 Test Success Rate < 100%**
   - VIOLATION: Failing tests
   - CORRECTION: Fix test issues immediately
   - AGENT RESPONSIBLE: Quality Assurance

---

## 🎯 AGENT COORDINATION PROTOCOL

### **Development Phase Coordination:**

1. **Architectural Decisions:**
   - Lead Agent: Software Architect
   - Supporting Agents: Type Safety Specialist, Documentation Specialist
   - Approval: All agents must sign off on architecture changes

2. **Performance Optimization:**
   - Lead Agent: Performance Engineer
   - Supporting Agents: Type Safety Specialist, Quality Assurance
   - Validation: Performance benchmarks must pass

3. **Type Safety Implementation:**
   - Lead Agent: Type Safety Specialist
   - Supporting Agents: Software Architect, Quality Assurance
   - Validation: Zero any types enforced

4. **Quality Assurance:**
   - Lead Agent: Quality Assurance
   - Supporting Agents: All agents
   - Validation: All quality gates must pass

### **Emergency Response Protocol:**

1. **Critical Architecture Violation:**
   - Detection: Any agent
   - Response: Software Architect leads correction
   - Timeline: Immediate (within 30 minutes)

2. **Performance Regression:**
   - Detection: Performance Engineer or CI/CD
   - Response: Performance Engineer leads optimization
   - Timeline: Immediate (within 1 hour)

3. **Type Safety Violation:**
   - Detection: Type Safety Specialist or code review
   - Response: Type Safety Specialist leads correction
   - Timeline: Immediate (within 1 hour)

---

## 📋 AGENT CHECKLISTS

### **Before Commit Checklist:**
- [ ] **Software Architect:** Architecture compliance verified
- [ ] **Performance Engineer:** Performance benchmarks passing
- [ ] **Quality Assurance:** All tests passing (100% success rate)
- [ ] **Type Safety Specialist:** Zero any types verified
- [ ] **Documentation Specialist:** Documentation updated

### **After Push Checklist:**
- [ ] **Quality Assurance:** CI/CD pipeline validation
- [ ] **Performance Engineer:** Production performance validation
- [ ] **Documentation Specialist:** Status report updated
- [ ] **Software Architect:** Production architecture validation

---

## 🚀 AGENT EMPOWERMENT

### **Decision Authority:**
- **Software Architect:** Final say on architecture decisions
- **Performance Engineer:** Final say on performance requirements
- **Type Safety Specialist:** Final say on type safety requirements
- **Quality Assurance:** Final say on quality gates
- **Documentation Specialist:** Final say on documentation standards

### **Correction Authority:**
- **All Agents:** Authority to halt development for critical violations
- **Software Architect:** Authority to rollback architectural violations
- **Type Safety Specialist:** Authority to reject any-type implementations
- **Quality Assurance:** Authority to reject failing test deployments

---

## 🎯 CURRENT AGENT PRIORITIES

### **Phase 1: Emergency Corrections** (CURRENT)
- **Software Architect:** Ensure proper TypeSpec AssetEmitter focus
- **Type Safety Specialist:** Eliminate all 'any' types immediately
- **Quality Assurance:** Fix remaining test failures
- **Documentation Specialist:** Update documentation for AssetEmitter focus

### **Phase 2: Type Safety Implementation** (NEXT)
- **Type Safety Specialist:** Lead comprehensive type guard implementation
- **Software Architect:** Review domain model abstractions
- **Performance Engineer:** Validate type safety doesn't impact performance
- **Quality Assurance:** Add comprehensive type safety tests

### **Phase 3: AssetEmitter Completion** (FINAL)
- **Software Architect:** Lead proper AssetEmitter implementation
- **Type Safety Specialist:** Ensure TypeSpec integration is type-safe
- **Performance Engineer:** Validate AssetEmitter performance
- **Documentation Specialist:** Document proper AssetEmitter usage

---

## 🏆 AGENT SUCCESS METRICS

### **Individual Agent Success:**
- **Software Architect:** Clean architecture, zero violations
- **Performance Engineer:** Sub-millisecond performance maintained
- **Quality Assurance:** 100% test success rate maintained
- **Type Safety Specialist:** Zero any types throughout codebase
- **Documentation Specialist:** Comprehensive, accurate documentation

### **Team Success Metrics:**
- **Type Safety:** Zero any types, proper type guards everywhere
- **Performance:** Sub-millisecond generation, zero memory leaks
- **Quality:** 100% test success rate, zero compilation errors
- **Architecture:** Clean AssetEmitter implementation
- **Documentation:** Complete, accurate developer resources

---

## 🚨 IMMEDIATE AGENT ACTION ITEMS

### **Software Architect:**
- [ ] Verify all CLI code is removed
- [ ] Validate AssetEmitter implementation plan
- [ ] Review domain model architecture
- [ ] Ensure clean architecture principles

### **Type Safety Specialist:**
- [ ] Audit codebase for any remaining 'any' types
- [ ] Implement comprehensive type guard system
- [ ] Create TypeSpec type abstractions
- [ ] Validate type safety across all modules

### **Quality Assurance:**
- [ ] Fix remaining 2 failing tests
- [ ] Ensure 100% test success rate
- [ ] Validate Go formatting compliance
- [ ] Add comprehensive test coverage

### **Performance Engineer:**
- [ ] Validate current performance benchmarks
- [ ] Ensure sub-millisecond generation maintained
- [ ] Check for memory leaks
- [ ] Optimize type intelligence performance

### **Documentation Specialist:**
- [ ] Update README.md to reflect AssetEmitter focus
- [ ] Create Agent configuration documentation
- [ ] Update architecture documentation
- [ ] Create development guidelines

---

**AGENT COORDINATION PROTOCOL: ACTIVE**  
**CURRENT PHASE: EMERGENCY ARCHITECTURAL CORRECTIONS**  
**NEXT PHASE: TYPE SAFETY IMPLEMENTATION**

---

*All Agents: Report status and coordinate through documentation*  
*Critical Violations: Immediate correction required*  
*Success: Zero violations, 100% quality gates passing*