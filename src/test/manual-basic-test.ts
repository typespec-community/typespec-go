/**
 * Manual Test for StandaloneGoGenerator
 * 
 * This tests our basic Go generation functionality without
 * the complex TypeSpec testing framework.
 */

import { StandaloneGoGenerator } from '../refactored-standalone-generator.js';
import { TypeSpecTypeMapper, TypeSpecPropertyNode } from '../mappers/type-mapper.js';

// Create a simple test
function runBasicTest() {
  console.log('🧪 Testing basic Go generation...');
  
  try {
    const generator = new StandaloneGoGenerator();
    
    // Create a simple TypeSpec model
    const properties = new Map<string, TypeSpecPropertyNode>();
    
    properties.set('name', {
      name: 'name',
      type: { kind: 'String' },
      optional: false,
      documentation: 'User name'
    });
    
    properties.set('age', {
      name: 'age', 
      type: { kind: 'Uint8' },
      optional: true,
      documentation: 'User age (0-255)'
    });
    
    const model = {
      name: 'User',
      properties
    };
    
    // Generate Go code
    const goCode = generator.generateModel(model);
    
    console.log('✅ SUCCESS: Go code generated:');
    console.log(goCode);
    
    return true;
  } catch (error) {
    console.error('❌ FAILED:', error);
    return false;
  }
}

// Run the test
runBasicTest();