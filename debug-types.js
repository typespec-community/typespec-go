import { GoTypeMapper } from "../src/domain/go-type-mapper.js";

console.log("🧪 TESTING TYPE MAPPING DIRECTLY");

// Test scalar mapping
const scalarType = { kind: "scalar", name: "string" };
const scalarResult = GoTypeMapper.mapTypeSpecType(scalarType, "testField");
console.log("📊 Scalar Result:", scalarResult);

// Test int32 mapping  
const intType = { kind: "scalar", name: "int32" };
const intResult = GoTypeMapper.mapTypeSpecType(intType, "id");
console.log("📊 Int32 Result:", intResult);

// Test array mapping
const arrayType = { kind: "Array", elementType: { kind: "scalar", name: "string" } };
const arrayResult = GoTypeMapper.mapTypeSpecType(arrayType, "items");
console.log("📊 Array Result:", arrayResult);