// Test basic import resolution
console.log("🧪 Testing import resolution...");

try {
  // Test core import
  const coreTesting = await import("@alloy-js/core/testing");
  console.log("✅ Core testing import successful");
  console.log("   Available functions:", Object.keys(coreTesting));

  // Test go import  
  const goComponents = await import("@alloy-js/go");
  console.log("✅ Go components import successful");
  console.log("   Available components:", Object.keys(goComponents));

  console.log("🎉 IMPORT RESOLUTION WORKING!");
  
} catch (error) {
  console.error("❌ Import resolution failed:", error);
  process.exit(1);
}