/**
 * Debug Clean Type Mapper
 */

import { CleanTypeMapper } from "./src/domain/clean-type-mapper.js";

console.log("=== DEBUGGING CLEAN TYPE MAPPER ===");

const testTypes = [{ kind: "String" }, { kind: "Int32" }, { kind: "Uint32" }, { kind: "Boolean" }];

testTypes.forEach((type, index) => {
  console.log(`\n${index + 1}. Input type:`, type);

  try {
    const mappedType = CleanTypeMapper.mapType(type);
    console.log(`   Mapped type:`, mappedType);

    const goTypeString = CleanTypeMapper.generateGoTypeString(mappedType);
    console.log(`   Go type string: "${goTypeString}"`);

    const legacyResult = CleanTypeMapper.mapTypeSpecTypeLegacy(type);
    console.log(`   Legacy result:`, legacyResult);
  } catch (error) {
    console.log(`   Error:`, error);
  }
});
