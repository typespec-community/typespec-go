import { StandaloneGoGenerator } from './src/standalone-generator.js';

const generator = new StandaloneGoGenerator();

// Test spread operator from test
const baseModel = {
  name: "BaseUser",
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["name", { name: "name", type: { kind: "String" }, optional: false }],
  ]),
};

const extendedModel = {
  name: "ExtendedUser",
  properties: new Map([
    ["email", { name: "email", type: { kind: "String" }, optional: true }],
  ]),
  propertiesFromExtends: new Map(baseModel.properties),
};

console.log('Testing spread operator...');
console.log('Base properties:', Array.from(baseModel.properties.keys()));
console.log('Properties from extends:', Array.from(extendedModel.propertiesFromExtends.keys()));

try {
  const result = generator.generateModel(extendedModel);
  console.log('Spread result:', result._tag);
  if (result._tag === "success") {
    console.log('✅ Spread model works!');
    console.log(Array.from(result.data.values())[0]);
  } else {
    console.log('❌ Spread model failed:', result.message);
  }
} catch (error) {
  console.log('❌ Spread model exception:', error.message);
}