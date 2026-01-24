# TypeSpec to Go Type Mapping Guide

## Overview

This guide provides comprehensive documentation of how TypeSpec types are mapped to Go types by the TypeSpec Go Emitter. Understanding these mappings is essential for designing TypeSpec models that generate optimal Go code.

## Quick Reference Table

| TypeSpec Type | Go Type   | Optional Handling | Default Value | Notes                                   |
| ------------- | --------- | ----------------- | ------------- | --------------------------------------- |
| `String`      | `string`  | `*string`         | `""`          | UTF-8 text, JSON encoding               |
| `Int8`        | `int8`    | `*int8`           | `0`           | 8-bit signed integer (-128 to 127)      |
| `Int16`       | `int16`   | `*int16`          | `0`           | 16-bit signed integer (-32768 to 32767) |
| `Int32`       | `int32`   | `*int32`          | `0`           | 32-bit signed integer (-2³¹ to 2³¹-1)   |
| `Int64`       | `int64`   | `*int64`          | `0`           | 64-bit signed integer                   |
| `Uint8`       | `uint8`   | `*uint8`          | `0`           | 8-bit unsigned integer (0 to 255)       |
| `Uint16`      | `uint16`  | `*uint16`         | `0`           | 16-bit unsigned integer (0 to 65535)    |
| `Uint32`      | `uint32`  | `*uint32`         | `0`           | 32-bit unsigned integer (0 to 2³²-1)    |
| `Uint64`      | `uint64`  | `*uint64`         | `0`           | 64-bit unsigned integer                 |
| `Float32`     | `float32` | `*float32`        | `0.0`         | IEEE-754 32-bit floating point          |
| `Float64`     | `float64` | `*float64`        | `0.0`         | IEEE-754 64-bit floating point          |
| `Boolean`     | `bool`    | `*bool`           | `false`       | Boolean value                           |
| `Array<T>`    | `[]T`     | `*[]T`            | `nil`         | Slice/Array of type T                   |

## Detailed Type Mapping

### String Types

#### TypeSpec: `String`

```typespec
stringField: string;
optionalString?: string;
```

#### Generated Go:

```go
StringField string `json:"stringField"`
OptionalString *string `json:"optionalString,omitempty"`
```

#### Characteristics:

- **Go Type**: `string`
- **Optional**: `*string` (pointer to string)
- **JSON Tag**: `json:"fieldName"`
- **Optional JSON**: `json:"fieldName,omitempty"`
- **Default Value**: `""` (empty string)
- **Memory Usage**: ~16 bytes + content
- **Encoding**: UTF-8
- **Usage**: General text data, identifiers, URLs

#### Best Practices:

- Use `String` for all text data that fits in memory
- Consider length validation in business logic
- Use pointers (`*string`) for optional fields to distinguish empty vs null

---

### Integer Types - Signed

#### TypeSpec: `Int8`, `Int16`, `Int32`, `Int64`

```typespec
age: int8;
count: int16;
score: int32;
timestamp: int64;

optionalAge?: int8;
```

#### Generated Go:

```go
Age int8 `json:"age"`
Count int16 `json:"count"`
Score int32 `json:"score"`
Timestamp int64 `json:"timestamp"`
OptionalAge *int8 `json:"optionalAge,omitempty"`
```

#### Characteristics:

- **Range**: Signed 2's complement integers
- **Optional**: Pointer to integer type
- **JSON**: Numbers, string representation possible
- **Memory**: 1, 2, 4, or 8 bytes
- **Endianness**: Platform-dependent

#### Signed Integer Ranges:

| Type    | Range             | Memory  | Use Case                      |
| ------- | ----------------- | ------- | ----------------------------- |
| `int8`  | -128 to 127       | 1 byte  | Small counters, flags         |
| `int16` | -32,768 to 32,767 | 2 bytes | Medium counters, coordinates  |
| `int32` | -2³¹ to 2³¹-1     | 4 bytes | General purpose, IDs, counts  |
| `int64` | -2⁶³ to 2⁶³-1     | 8 bytes | Timestamps, large counts, IDs |

#### Best Practices:

- Use `int32` for most integer values (most efficient on modern CPUs)
- Use `int64` for timestamps, Unix time, large IDs
- Use `int8`/`int16` for small ranges to save memory
- Consider overflow implications in business logic

---

### Integer Types - Unsigned

#### TypeSpec: `Uint8`, `Uint16`, `Uint32`, `Uint64`

```typespec
byte: uint8;
port: uint16;
itemId: uint32;
bigNumber: uint64;

optionalByte?: uint8;
```

#### Generated Go:

```go
Byte uint8 `json:"byte"`
Port uint16 `json:"port"`
ItemId uint32 `json:"itemId"`
BigNumber uint64 `json:"bigNumber"`
OptionalByte *uint8 `json:"optionalByte,omitempty"`
```

#### Characteristics:

- **Range**: Unsigned positive integers
- **Optional**: Pointer to unsigned integer type
- **JSON**: Numbers, validation for negative values
- **Memory**: 1, 2, 4, or 8 bytes

#### Unsigned Integer Ranges:

| Type     | Range                           | Memory  | Use Case                     |
| -------- | ------------------------------- | ------- | ---------------------------- |
| `uint8`  | 0 to 255                        | 1 byte  | Bytes, small counters, flags |
| `uint16` | 0 to 65,535                     | 2 bytes | Ports, medium counters       |
| `uint32` | 0 to 4,294,967,295              | 4 bytes | IDs, counts, large numbers   |
| `uint64` | 0 to 18,446,744,073,709,551,615 | 8 bytes | Very large IDs, counters     |

#### Best Practices:

- Use `uint8` for raw bytes, RGB values
- Use `uint16` for network ports, year values
- Use `uint32` for database IDs, counts
- Use `uint64` for very large identifiers, counters
- Validate JSON inputs to prevent negative values

---

### Floating Point Types

#### TypeSpec: `Float32`, `Float64`

```typespec
price: float64;
temperature: float32;
rating: float64;

optionalTemperature?: float32;
```

#### Generated Go:

```go
Price float64 `json:"price"`
Temperature float32 `json:"temperature"`
Rating float64 `json:"rating"`
OptionalTemperature *float32 `json:"optionalTemperature,omitempty"`
```

#### Characteristics:

- **Format**: IEEE-754 floating point
- **Precision**: Variable (binary floating point)
- **Optional**: Pointer to floating point type
- **JSON**: Numbers, string representation possible

#### Floating Point Characteristics:

| Type      | Precision          | Range      | Memory  | Use Case                             |
| --------- | ------------------ | ---------- | ------- | ------------------------------------ |
| `float32` | ~7 decimal digits  | ~±3.4e±38  | 4 bytes | Graphics, scientific data            |
| `float64` | ~16 decimal digits | ~±1.8e±308 | 8 bytes | Financial data, precise measurements |

#### Best Practices:

- Use `float64` for most applications (better precision, similar performance)
- Use `float32` for graphics, machine learning, large datasets
- Never use floating point for monetary values (use integer cents instead)
- Consider `math.IsNaN()`, `math.IsInf()` for special values

---

### Boolean Types

#### TypeSpec: `Boolean`

```typespec
active: boolean;
verified?: boolean;
deleted: boolean;
```

#### Generated Go:

```go
Active bool `json:"active"`
Verified *bool `json:"verified,omitempty"`
Deleted bool `json:"deleted"`
```

#### Characteristics:

- **Go Type**: `bool`
- **Optional**: `*bool` (pointer to bool)
- **JSON**: Boolean values
- **Memory**: 1 byte (aligned to 1 byte)
- **Values**: `true`, `false`, `nil` (for optional)

#### Best Practices:

- Use `bool` for binary states
- Use pointer (`*bool`) for three-state logic (true, false, null)
- Consider default values carefully
- Validate JSON boolean strings

---

### Array Types

#### TypeSpec: `Array<T>`

```typespec
tags: string[];
scores: int32[];
items: ComplexType[];

optionalTags?: string[];
```

#### Generated Go:

```go
Tags []string `json:"tags"`
Scores []int32 `json:"scores"`
Items []ComplexType `json:"items"`
OptionalTags *[]string `json:"optionalTags,omitempty"`
```

#### Characteristics:

- **Go Type**: Slice `[]T`
- **Optional**: `*[]T` (pointer to slice)
- **JSON**: Arrays
- **Memory**: Overhead + element storage

#### Array Behavior:

| Feature     | Go Implementation            | TypeSpec Equivalent |
| ----------- | ---------------------------- | ------------------- |
| Empty Array | `[]string{}` or `nil`        | `[]`                |
| Null Array  | `nil` pointer                | `undefined`         |
| Length      | `len(array)`                 | `array.length`      |
| Append      | `append(array, item)`        | `array.push(item)`  |
| Iterate     | `for _, item := range array` | `for item of array` |

#### Best Practices:

- Use slices for dynamic arrays
- Consider capacity hints for performance
- Handle `nil` vs empty slice carefully
- Validate array elements in business logic

---

## Special Cases and Edge Conditions

### Null vs Empty Values

#### Strings:

```typespec
name: string;           // Required, non-null
email?: string;         // Optional, may be null
```

```go
Name string `json:"name"`                    // Always present
Email *string `json:"email,omitempty"`       // null if not provided
```

#### Arrays:

```typespec
tags: string[];        // Required array (may be empty)
items?: Item[];       // Optional array (may be null)
```

```go
Tags []string `json:"tags"`                 // Always present (may be empty)
Items *[]Item `json:"items,omitempty"`      // null if not provided
```

### JSON Serialization Behavior

#### Required Fields:

```go
type User struct {
  Name string `json:"name"`           // Always in JSON
  Age  int32  `json:"age"`            // Always in JSON
}
```

#### Optional Fields:

```go
type User struct {
  Email *string `json:"email,omitempty"`   // Omitted if nil
  Bio   *string `json:"bio,omitempty"`     // Omitted if nil
}
```

#### Example JSON Output:

```json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com"
  // "bio" omitted because it's null
}
```

## Performance Considerations

### Memory Usage

| Type      | Size (bytes)    | Aligned Size    | Cache Efficiency |
| --------- | --------------- | --------------- | ---------------- |
| `string`  | Length + 16     | 16 + length     | Good             |
| `*string` | 8 (pointer)     | 8               | Excellent        |
| `int8`    | 1               | 1               | Excellent        |
| `int16`   | 2               | 2               | Excellent        |
| `int32`   | 4               | 4               | Excellent        |
| `int64`   | 8               | 8               | Good             |
| `bool`    | 1               | 1               | Excellent        |
| `*bool`   | 8               | 8               | Good             |
| `[]T`     | 24 + elements\* | 24 + elements\* | Variable         |

### CPU Performance

#### Most Efficient (Platform Native):

- `int32` - Native word size on 32-bit systems
- `int64` - Native word size on 64-bit systems
- `float64` - Native floating point

#### Less Efficient:

- `int8`, `uint8` - May require masking
- `int16`, `uint16` - May require masking
- `float32` - May require conversion (less precise)

### Optimization Recommendations

1. **Choose Appropriate Sizes**:

   ```typespec
   // Good
   id: uint32;        // Fits in 32 bits
   age: uint8;        // 0-255 is sufficient
   score: uint16;      // 0-65535 is enough
   ```

2. **Minimize Optional Fields**:

   ```typespec
   // Prefer
   active: boolean;
   deactivatedAt?: string;  // Optional timestamp

   // Over
   active?: boolean;
   deactivatedAt?: string;
   ```

3. **Consider Array Alternatives**:

   ```typespec
   // For small fixed arrays
   coordinates: [3] float64;  // Future TypeSpec feature

   // Current workaround
   x: float64;
   y: float64;
   z: float64;
   ```

## Validation and Error Handling

### Type Safety Guarantees

The TypeSpec Go Emitter ensures:

1. **No Invalid Types**: All TypeSpec types map to valid Go types
2. **Optional Consistency**: Optional fields always use pointers
3. **JSON Compatibility**: All generated types serialize to valid JSON
4. **Memory Safety**: No pointer arithmetic, safe memory access

### Validation Patterns

#### Custom Validation:

```go
// In your application code
func (u *User) Validate() error {
    if u.Name == "" {
        return errors.New("name is required")
    }
    if u.Age < 0 || u.Age > 150 {
        return errors.New("age must be between 0 and 150")
    }
    if u.Email != nil && !strings.Contains(*u.Email, "@") {
        return errors.New("invalid email format")
    }
    return nil
}
```

#### JSON Validation:

```go
// Use struct tags for validation
type User struct {
    Name  string `json:"name" validate:"required,min=1,max=100"`
    Email  string `json:"email" validate:"email"`
    Age   int32  `json:"age" validate:"min=0,max=150"`
}
```

## Migration Guide

### From Previous Type Systems

#### JSON Schema to TypeSpec:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" },
    "active": { "type": "boolean" }
  },
  "required": ["name", "active"]
}
```

```typespec
model User {
  name: string;
  age?: integer;    // Optional if not in required
  active: boolean;
}
```

#### Protocol Buffers to TypeSpec:

```protobuf
message User {
  string name = 1;
  int32 age = 2;
  bool active = 3;
}
```

```typespec
model User {
  name: string;
  age?: int32;     // Proto3 optional = ?
  active: boolean;
}
```

## Common Patterns

### Pagination:

```typespec
model PaginatedResponse {
  items: Item[];
  page: uint32;
  pageSize: uint32;
  totalCount: uint64;
  hasMore: boolean;
}
```

```go
type PaginatedResponse struct {
  Items      []Item  `json:"items"`
  Page       uint32  `json:"page"`
  PageSize   uint32  `json:"pageSize"`
  TotalCount uint64  `json:"totalCount"`
  HasMore    bool    `json:"hasMore"`
}
```

### Audit Trail:

```typespec
model AuditEntry {
  id: uint64;
  userId: uint32;
  action: string;
  resource: string;
  timestamp: int64;
  ipAddress?: string;
  userAgent?: string;
}
```

```go
type AuditEntry struct {
  Id         uint64  `json:"id"`
  UserId     uint32  `json:"userId"`
  Action     string  `json:"action"`
  Resource   string  `json:"resource"`
  Timestamp  int64   `json:"timestamp"`
  IpAddress  *string `json:"ipAddress,omitempty"`
  UserAgent  *string `json:"userAgent,omitempty"`
}
```

### Configuration:

```typespec
model Config {
  server: {
    host: string;
    port: uint16;
    tls: boolean;
  };
  database: {
    url: string;
    maxConnections: uint32;
    timeout: uint32;
  };
  logging: {
    level: string;
    format: string;
    file?: string;
  };
}
```

This generates nested Go structs following the same mapping rules.

---

## Summary

- **Comprehensive Coverage**: All TypeSpec primitive types map to appropriate Go types
- **Optional Handling**: Consistent pointer usage for optional fields
- **JSON Compatibility**: All generated types serialize correctly to/from JSON
- **Performance Optimized**: Types chosen for Go performance characteristics
- **Memory Efficient**: Appropriate sizing for different use cases
- **Type Safe**: No runtime type conversion errors

Understanding these mappings ensures optimal TypeSpec model design and predictable Go code generation.

For specific implementation details or edge cases, refer to the generated Go code and test files in the TypeSpec Go Emitter project.
