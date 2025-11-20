import { StandaloneGoGenerator } from './src/standalone-generator.js';

console.log('Testing StandaloneGoGenerator...');

const generator = new StandaloneGoGenerator();

// Test basic functionality first
const basicModel = {
  name: "TestUser",
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["name", { name: "name", type: { kind: "String" }, optional: false }],
  ]),
};

console.log('Testing basic model...');
const result1 = generator.generateModel(basicModel);
console.log('Result:', result1._tag);
if (result1._tag === "success") {
  console.log('✅ Basic model works!');
} else {
  console.log('❌ Basic model failed:', result1.message);
}

// Test extends model
const extendsModel = {
  name: "User",
  extends: "BaseEntity",
  properties: new Map([
    ["username", { name: "username", type: { kind: "String" }, optional: false }],
    ["email", { name: "email", type: { kind: "String" }, optional: true }],
  ]),
};

console.log('\nTesting extends model...');
const result2 = generator.generateModel(extendsModel);
console.log('Result:', result2._tag);
if (result2._tag === "success") {
  console.log('✅ Extends model works!');
  console.log(Array.from(result2.data.values())[0]);
} else {
  console.log('❌ Extends model failed:', result2.message);
  if (result2.details) {
    console.log('Details:', result2.details);
  }
}