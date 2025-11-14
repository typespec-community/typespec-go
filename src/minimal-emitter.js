import { SimpleGoGenerator } from "./minimal-generator.js";
/**
 * Minimal working emitter function
 * Uses string-based Go generation with zero complexity
 */
export async function $onEmit(context) {
    const { program } = context;
    console.log("🚀 Minimal String-Based Emitter Started");
    console.log("📁 Models found:", program.models.size);
    const generator = new SimpleGoGenerator();
    const results = {};
    // Generate Go code for each model
    for (const [namespace, models] of program.models) {
        for (const model of models) {
            console.log(`🏗️  Generating Go for model: ${model.name}`);
            try {
                const goCode = generator.generateModel(model);
                const fileName = `${namespace}/${model.name.toLowerCase()}.go`;
                results[fileName] = goCode;
                console.log(`✅ Generated: ${fileName}`);
            }
            catch (error) {
                console.error(`❌ Failed to generate ${model.name}:`, error);
                // Continue with other models instead of failing completely
            }
        }
    }
    console.log(`📦 Generated ${Object.keys(results).length} Go files`);
    return results;
}
