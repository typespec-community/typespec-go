import { StandaloneGoGenerator } from './src/standalone-generator.js';

const generator = new StandaloneGoGenerator();

// Test extends keyword
const extendsModel = {
  name: "User",
  extends: "BaseEntity",
  properties: new Map([
    ["username", { name: "username", type: { kind: "String" }, optional: false }],
    ["email", { name: "email", type: { kind: "String" }, optional: true }],
  ]),
};

console.log('Testing extends model...');
try {
  const result2 = generator.generateModel(extendsModel);
  console.log('Extends result:', result2._tag);
  if (result2._tag === "success") {
    console.log('✅ Extends model works!');
    console.log(Array.from(result2.data.values())[0]);
  } else {
    console.log('❌ Extends model failed:', result2.message);
    if (result2.details) {
      console.log('Details:', result2.details);
    }
  }
} catch (error) {
  console.log('❌ Extends model exception:', error.message);
}