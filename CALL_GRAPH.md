# TypeSpec Go Emitter - Comprehensive Call Graph

## High-Level Architecture Overview

```mermaid
graph TB
    %% Entry Points
    Entry[TypeSpec Compiler] --> $onEmit[$onEmit Function]
    
    %% Main Flow
    $onEmit --> CollectTypes[collectTypesByNamespace]
    $onEmit --> GoPackageDirectory[GoPackageDirectory Component]
    $onEmit --> WriteOutput[writeOutput]
    
    %% Domain Modules
    subgraph "Domain Layer"
        TypeMapper[CleanTypeMapper]
        ErrorFactory[ErrorFactory]
        StructGen[StructGenerator]
        UnionGen[UnionGenerator]
        Logger[StructuredLogger]
    end
    
    %% Component Layer
    subgraph "Component Layer (Alloy-JS)"
        GoStruct[GoStructDeclaration]
        GoEnum[GoEnumDeclaration]
        GoUnion[GoUnionDeclaration]
        GoInterface[GoInterfaceDeclaration]
        GoMod[GoModFile]
    end
    
    %% Service Layer
    subgraph "Service Layer"
        TypeMappingService[TypeMappingService]
    end
    
    %% Utility Layer
    subgraph "Utility Layer"
        Strings[StringUtils]
        TypeSpecUtils[TypeSpecUtils]
        GoFormatter[GoFormatter]
    end
    
    %% Type System
    subgraph "Type System"
        EmitterTypes[Emitter Types]
        DomainTypes[Domain Types]
    end
    
    %% Connections
    CollectTypes --> Logger
    GoPackageDirectory --> GoStruct
    GoPackageDirectory --> GoEnum
    GoPackageDirectory --> GoUnion
    GoPackageDirectory --> GoInterface
    GoPackageDirectory --> GoMod
    
    GoStruct --> TypeMapper
    GoEnum --> TypeMapper
    GoUnion --> TypeMapper
    GoInterface --> TypeMapper
    
    TypeMapper --> EmitterTypes
    TypeMapper --> DomainTypes
    TypeMapper --> Strings
    TypeMapper --> TypeSpecUtils
    
    StructGen --> TypeMapper
    UnionGen --> TypeMapper
    ErrorFactory --> Logger
    
    TypeMappingService --> TypeMapper
    TypeMappingService --> EmitterTypes
    
    %% Error Flow
    TypeMapper -.-> ErrorFactory
    StructGen -.-> ErrorFactory
    UnionGen -.-> ErrorFactory
    GoPackageDirectory -.-> ErrorFactory
    
    %% Styling
    classDef entryPoint fill:#e1f5fe
    classDef domain fill:#f3e5f5
    classDef component fill:#e8f5e8
    classDef service fill:#fff3e0
    classDef utility fill:#fce4ec
    classDef types fill:#f1f8e9
    classDef errorFlow fill:#ffebee,stroke:#f44336,stroke-dasharray:5 5
    
    class Entry entryPoint
    class TypeMapper,ErrorFactory,StructGen,UnionGen,Logger domain
    class GoStruct,GoEnum,GoUnion,GoInterface,GoMod component
    class TypeMappingService service
    class Strings,TypeSpecUtils,GoFormatter utility
    class EmitterTypes,DomainTypes types
```

## Detailed Emission Flow

```mermaid
flowchart TD
    Start[$onEmit Entry] --> GetProgram[Get TypeSpec Program]
    GetProgram --> GetGlobal[Get Global Namespace]
    GetGlobal --> CollectTypes[collectTypesByNamespace]
    
    CollectTypes --> ProcessNamespace[Process Each Namespace]
    ProcessNamespace --> GroupModels[Group Models]
    ProcessNamespace --> GroupEnums[Group Enums]
    ProcessNamespace --> GroupUnions[Group Unions]
    ProcessNamespace --> GroupOps[Group Operations]
    
    GroupModels --> CreatePackage[Create GoPackageDirectory]
    GroupEnums --> CreatePackage
    GroupUnions --> CreatePackage
    GroupOps --> CreatePackage
    
    CreatePackage --> DetermineImports[Analyze Import Needs]
    DetermineImports --> TimeCheck{Needs time.Time?}
    DetermineImports --> FmtCheck{Needs fmt package?}
    
    TimeCheck -->|Yes| AddTimeImport[Add Time Import]
    FmtCheck -->|Yes| AddFmtImport[Add Fmt Import]
    
    AddTimeImport --> GenerateModels[Generate models.go]
    AddFmtImport --> GenerateUnions[Generate unions.go]
    GenerateModels --> RenderStructs[Render GoStructDeclaration]
    GenerateUnions --> RenderUnions[Render GoUnionDeclaration]
    
    RenderStructs --> TypeMapping[mapTypeSpecType]
    RenderUnions --> TypeMapping
    TypeMapping --> ValidateType[validateMapping]
    
    ValidateType --> GenerateCode[Generate Go Code]
    GenerateCode --> WriteFiles[writeOutput]
    WriteFiles --> Complete[Emission Complete]
    
    %% Error Handling
    TypeMapping -.->|Error| CreateError[ErrorFactory.createError]
    ValidateType -.->|Error| CreateError
    GenerateCode -.->|Error| CreateError
    
    CreateError --> LogError[Log Structured Error]
    LogError --> ThrowError[Throw Error]
    
    %% Styling
    classDef mainFlow fill:#e3f2fd
    classDef componentFlow fill:#e8f5e8
    classDef errorFlow fill:#ffebee,stroke:#f44336,stroke-dasharray:5 5
    classDef decision fill:#fff3e0
    
    class Start,GetProgram,GetGlobal,CollectTypes,ProcessNamespace,GroupModels,GroupEnums,GroupUnions,GroupOps,CreatePackage,DetermineImports,GenerateCode,WriteFiles,Complete mainFlow
    class TimeCheck,FmtCheck decision
    class AddTimeImport,AddFmtImport,GenerateModels,GenerateUnions,RenderStructs,RenderUnions,TypeMapping,ValidateType componentFlow
    class CreateError,LogError,ThrowError errorFlow
```

## Component Architecture Flow

```mermaid
graph LR
    %% Input
    Input[TypeSpec Types] --> GoPackageDirectory
    
    %% Component Orchestration
    subgraph "GoPackageDirectory Component"
        ModelsFile[SourceFile: models.go]
        EnumsFile[SourceFile: enums.go]
        UnionsFile[SourceFile: unions.go]
        InterfacesFile[SourceFile: interfaces.go]
        GoModFile[SourceFile: go.mod]
    end
    
    GoPackageDirectory --> ModelsFile
    GoPackageDirectory --> EnumsFile
    GoPackageDirectory --> UnionsFile
    GoPackageDirectory --> InterfacesFile
    GoPackageDirectory --> GoModFile
    
    %% Model Generation
    subgraph "Model Components"
        GoStruct[GoStructDeclaration]
        StructMember[StructMember Component]
        TypeExpression[TypeExpression Component]
    end
    
    ModelsFile --> GoStruct
    GoStruct --> StructMember
    GoStruct --> TypeExpression
    
    %% Enum Generation
    subgraph "Enum Components"
        GoEnum[GoEnumDeclaration]
        EnumMember[EnumMember Component]
    end
    
    EnumsFile --> GoEnum
    GoEnum --> EnumMember
    
    %% Union Generation
    subgraph "Union Components"
        GoUnion[GoUnionDeclaration]
        InterfaceDecl[InterfaceDeclaration Component]
        TypeConstraint[TypeConstraint Component]
    end
    
    UnionsFile --> GoUnion
    GoUnion --> InterfaceDecl
    GoUnion --> TypeConstraint
    
    %% Interface Generation
    subgraph "Interface Components"
        GoInterface[GoInterfaceDeclaration]
        MethodDecl[MethodDeclaration Component]
    end
    
    InterfacesFile --> GoInterface
    GoInterface --> MethodDecl
    
    %% Utility Components
    subgraph "Utility Components"
        GoMod[GoModFile Component]
        ImportBlock[ImportBlock Component]
        DocComment[DocComment Component]
    end
    
    GoModFile --> GoMod
    ModelsFile --> ImportBlock
    EnumsFile --> ImportBlock
    UnionsFile --> ImportBlock
    InterfacesFile --> ImportBlock
    
    GoStruct --> DocComment
    GoEnum --> DocComment
    GoUnion --> DocComment
    GoInterface --> DocComment
    
    %% Styling
    classDef orchestrator fill:#e1f5fe
    classDef component fill:#e8f5e8
    classDef utility fill:#fff3e0
    
    class GoPackageDirectory orchestrator
    class GoStruct,GoEnum,GoUnion,GoInterface component
    class StructMember,EnumMember,InterfaceDecl,MethodDecl,TypeExpression,TypeConstraint,GoMod,ImportBlock,DocComment utility
```

## Type Mapping System Flow

```mermaid
flowchart TD
    StartType[TypeSpec Type] --> TypeGuard{Type Kind?}
    
    TypeGuard -->|Scalar| MapScalar[mapScalarType]
    TypeGuard -->|Model| MapModel[mapModelType]
    TypeGuard -->|Enum| MapEnum[mapEnumType]
    TypeGuard -->|Union| MapUnion[mapUnionType]
    TypeGuard -->|Array| MapArray[mapArrayType]
    TypeGuard -->|Template| MapTemplate[mapTemplateType]
    
    MapScalar --> ScalarCheck{Scalar Type?}
    ScalarCheck -->|string| GoString[GoString]
    ScalarCheck -->|int32| GoInt32[GoInt32]
    ScalarCheck -->|uint32| GoUint32[GoUint32]
    ScalarCheck -->|float64| GoFloat64[GoFloat64]
    ScalarCheck -->|bool| GoBool[GoBool]
    ScalarCheck -->|time.Time| GoTime[GoTime]
    ScalarCheck -->|Unknown| UnknownScalar[UnknownScalarError]
    
    MapModel --> ModelCheck{Model Properties?}
    ModelCheck -->|Has Properties| StructType[StructName]
    ModelCheck -->|No Properties| InterfaceType[InterfaceName]
    ModelCheck -->|Template| TemplateType[TemplateName]
    
    MapArray --> ArrayElement[Map Element Type]
    ArrayElement --> ArraySlice[[]ElementType]
    
    MapUnion --> UnionCheck{Discriminated?}
    UnionCheck -->|Yes| SealedInterface[SealedInterface]
    UnionCheck -->|No| InterfaceUnion[InterfaceUnion]
    
    MapEnum --> EnumOptions{Enum Options?}
    EnumOptions -->|String Values| StringEnum[StringEnum]
    EnumOptions -->|Integer Values| IntEnum[IntEnum]
    EnumOptions -->|Unknown| UnknownEnum[UnknownEnumError]
    
    MapTemplate --> TemplateParams[Process Template]
    TemplateParams --> Instantiate[Instantiate Template]
    
    %% Import Tracking
    GoString --> TrackImports[trackRequiredImports]
    GoTime --> TrackImports
    GoFloat64 --> TrackImports
    ArraySlice --> TrackImports
    SealedInterface --> TrackImports
    
    TrackImports --> ValidateMapping[validateMapping]
    ValidateMapping --> Success[GoTypeResult.Success]
    
    %% Error Paths
    UnknownScalar --> ErrorResult[GoTypeResult.Error]
    UnknownEnum --> ErrorResult
    ValidationFailed --> ErrorResult
    
    %% Styling
    classDef input fill:#e1f5fe
    classDef mapping fill:#e8f5e8
    classDef validation fill:#fff3e0
    classDef success fill:#c8e6c9
    classDef error fill:#ffcdd2
    
    class StartType input
    class MapScalar,MapModel,MapEnum,MapUnion,MapArray,MapTemplate,ScalarCheck,ModelCheck,ArrayElement,UnionCheck,EnumOptions,TemplateParams mapping
    class TrackImports,ValidateMapping validation
    class Success success
    class ErrorResult,UnknownScalar,UnknownEnum error
```

## Error Handling System Flow

```mermaid
stateDiagram-v2
    [*] --> NormalOperation
    
    NormalOperation --> ErrorDetected: Type Mapping Fails
    NormalOperation --> ErrorDetected: Validation Fails
    NormalOperation --> ErrorDetected: Generation Fails
    
    ErrorDetected --> ErrorFactory: Create Error Entity
    
    state ErrorFactory {
        [*] --> CategorizeError
        CategorizeError --> TypeMappingError: Type Mapping
        CategorizeError --> ValidationError: Validation
        CategorizeError --> GenerationError: Generation
        CategorizeError --> SystemError: System
        
        TypeMappingError --> CreateEntity
        ValidationError --> CreateEntity
        GenerationError --> CreateEntity
        SystemError --> CreateEntity
        
        CreateEntity --> AddContext
        AddContext --> AddRecovery
        AddRecovery --> ErrorEntity
    }
    
    ErrorFactory --> ErrorEntity: Discriminated Error
    
    ErrorEntity --> LogError: Structured Logging
    ErrorEntity --> AttemptRecovery: Has Recovery?
    
    AttemptRecovery --> Yes: Recovery Strategy
    AttemptRecovery --> No: No Recovery
    
    Recovery Strategy --> RecoverySuccess: Recovery Works
    Recovery Strategy --> RecoveryFailed: Recovery Fails
    
    RecoverySuccess --> NormalOperation: Continue
    RecoveryFailed --> ThrowError: Propagate Error
    
    No Recovery --> ThrowError
    LogError --> ThrowError: Critical Error
    
    ThrowError --> [*]: Error Propagated
    
    %% Styling
    classDef normal fill:#e8f5e8
    classDef error fill:#ffcdd2
    classDef recovery fill:#fff3e0
    classDef critical fill:#ffebee
    
    class NormalOperation,RecoverySuccess normal
    class ErrorDetected,ErrorFactory,ErrorEntity,ThrowError error
    class AttemptRecovery,Recovery Strategy recovery
    class Critical,LogError critical
```

## Service Integration Flow

```mermaid
sequenceDiagram
    participant TS as TypeSpec Compiler
    participant EM as $onEmit
    participant NS as Namespace Collector
    participant PD as GoPackageDirectory
    participant SM as TypeMappingService
    participant CM as CleanTypeMapper
    participant EF as ErrorFactory
    participant LG as Logger
    participant WO as writeOutput
    
    TS->>EM: Emit context
    EM->>LG: Log start
    EM->>NS: collectTypesByNamespace
    NS->>NS: processNestedNamespace
    NS-->>EM: Namespace groups
    
    loop For each namespace
        EM->>PD: Render GoPackageDirectory
        PD->>SM: mapTypeSpecType (service)
        SM->>CM: mapTypeSpecType (core)
        CM->>CM: Type mapping logic
        CM-->>SM: GoTypeResult
        SM-->>PD: Mapped type
        
        alt Type mapping succeeds
            PD->>PD: Render components
        else Type mapping fails
            PD->>EF: Create error
            EF->>LG: Log error
        end
        
        PD-->>EM: Rendered output
    end
    
    EM->>WO: writeOutput
    WO->>WO: Generate files
    WO-->>EM: File generation complete
    EM->>LG: Log completion
    EM-->>TS: Emission complete
```

## Import Resolution System

```mermaid
flowchart TD
    StartImports[Analyze Type Usage] --> ScanTypes[Scan All Types]
    
    ScanTypes --> CheckTime{Uses time.Time?}
    ScanTypes --> CheckFmt{Uses fmt package?}
    ScanTypes --> CheckJSON{Uses JSON?}
    ScanTypes --> CheckHTTP{Uses HTTP?}
    ScanTypes --> CheckMath{Uses math package?}
    
    CheckTime -->|Yes| TimeImport["time"]
    CheckFmt -->|Yes| FmtImport["fmt"]
    CheckJSON -->|Yes| JSONImport["encoding/json"]
    CheckHTTP -->|Yes| HTTPImport["net/http"]
    CheckMath -->|Yes| MathImport["math"]
    
    TimeImport --> CollectImports[Collect Imports]
    FmtImport --> CollectImports
    JSONImport --> CollectImports
    HTTPImport --> CollectImports
    MathImport --> CollectImports
    
    CollectImports --> CheckStdlib{Standard Library?}
    CheckStdlib -->|Yes| StdlibImport[Standard Import]
    CheckStdlib -->|No| ThirdPartyImport[Third-party Import]
    
    StdlibImport --> GenerateImportBlock[Generate Import Block]
    ThirdPartyImport --> GenerateImportBlock
    
    GenerateImportBlock --> SortImports[Sort Imports]
    SortImports --> FormatImports[Format Import Block]
    FormatImports --> InsertImports[Insert into Source File]
    
    %% Styling
    classDef analysis fill:#e1f5fe
    classDef detection fill:#e8f5e8
    classDef generation fill:#fff3e0
    classDef output fill:#c8e6c9
    
    class StartImports,ScanTypes analysis
    class CheckTime,CheckFmt,CheckJSON,CheckHTTP,CheckMath,CheckStdlib detection
    class TimeImport,FmtImport,JSONImport,HTTPImport,MathImport,StdlibImport,ThirdPartyImport,CollectImports,GenerateImportBlock generation
    class SortImports,FormatImports,InsertImports output
```

## Performance & Optimization Flow

```mermaid
graph TB
    Start[$onEmit Start] --> MeasureStart[Start Performance Timer]
    
    MeasureStart --> CacheCheck{Cache Available?}
    CacheCheck -->|Yes| CacheHit[Use Cached Results]
    CacheCheck -->|No| ProcessFresh[Process Fresh]
    
    ProcessFresh --> TypeCollection[Type Collection Phase]
    TypeCollection --> MeasureCollection[Collection Timing]
    
    MeasureCollection --> TypeMapping[Type Mapping Phase]
    TypeMapping --> MeasureMapping[Mapping Timing]
    
    MeasureMapping --> CodeGeneration[Code Generation Phase]
    CodeGeneration --> MeasureGeneration[Generation Timing]
    
    MeasureGeneration --> FileOutput[File Output Phase]
    FileOutput --> MeasureOutput[Output Timing]
    
    CacheHit --> LogPerformance[Log Performance Metrics]
    MeasureOutput --> LogPerformance
    
    LogPerformance --> CheckThreshold{Within Thresholds?}
    CheckThreshold -->|Yes| Success[Emission Success]
    CheckThreshold -->|No| PerformanceWarning[Log Performance Warning]
    
    PerformanceWarning --> Success
    
    %% Memory Management
    TypeCollection --> TrackMemory[Track Memory Usage]
    TypeMapping --> TrackMemory
    CodeGeneration --> TrackMemory
    FileOutput --> TrackMemory
    
    TrackMemory --> MemoryCheck{Memory Leak?}
    MemoryCheck -->|Yes| MemoryCleanup[Force Cleanup]
    MemoryCheck -->|No| ContinueProcess[Continue]
    
    MemoryCleanup --> ContinueProcess
    ContinueProcess --> LogPerformance
    
    %% Styling
    classDef timing fill:#e1f5fe
    classDef processing fill:#e8f5e8
    classDef performance fill:#fff3e0
    classDef memory fill:#f3e5f5
    classDef result fill:#c8e6c9
    
    class MeasureStart,MeasureCollection,MeasureMapping,MeasureGeneration,MeasureOutput timing
    class CacheCheck,ProcessFresh,TypeCollection,TypeMapping,CodeGeneration,FileOutput processing
    class LogPerformance,CheckThreshold,PerformanceWarning performance
    class TrackMemory,MemoryCheck,MemoryCleanup,ContinueProcess memory
    class CacheHit,Success result
```

---

## Call Graph Summary

This comprehensive call graph visualizes the TypeSpec Go emitter's architecture with:

1. **High-Level Overview**: Main modules and their relationships
2. **Detailed Emission Flow**: Step-by-step process from TypeSpec to Go code
3. **Component Architecture**: How Alloy-JS components interact
4. **Type Mapping System**: Complex type conversion logic
5. **Error Handling**: Unified error system with recovery strategies
6. **Service Integration**: How services coordinate the process
7. **Import Resolution**: Dynamic import management
8. **Performance Flow**: Optimization and monitoring

The architecture follows these key patterns:
- **Domain-Driven Design**: Clear separation of concerns
- **Component-Based Generation**: Alloy-JS for maintainable code gen
- **Type Safety**: Discriminated unions and strict typing
- **Error Resilience**: Comprehensive error handling with recovery
- **Performance Focus**: Caching and optimization strategies
- **Observable Operations**: Structured logging throughout

This call graph serves as a comprehensive reference for understanding the TypeSpec Go emitter's internal architecture and execution flow.