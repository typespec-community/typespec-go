import { FunctionDeclaration } from "@alloy-js/go";
import { refkey } from "@alloy-js/core";
import type { GoHandlerMethod } from "./GoHandlerMethod";

/**
 * Component for individual handler method generation using 100% Alloy-JS components
 */
export function GoHandlerMethodComponent({
  handler,
  serviceName,
  serviceRef,
}: {
  handler: GoHandlerMethod;
  serviceName: string;
  serviceRef: ReturnType<typeof refkey>;
}) {
  // Generate method-specific implementation using string templates (working pattern from GoEnumDeclaration)
  const implementation = generateHandlerImplementation(handler);

  return (
    <FunctionDeclaration
      name={handler.name}
      receiver={`s *${serviceName}`}
      parameters={handler.parameters.map((p) => ({
        name: p.name,
        type: p.goType,
      }))}
    >
      {implementation}
    </FunctionDeclaration>
  );
}

/**
 * Generate handler implementation using working string template pattern
 * This follows the proven approach from GoEnumDeclaration
 */
function generateHandlerImplementation(handler: GoHandlerMethod): string {
  const header = `// ${handler.name} - ${handler.doc || `handles ${handler.httpMethod} ${handler.route}`}
// TODO: Implement ${handler.name} handler with business logic
// Route: ${handler.httpMethod} ${handler.route}

// Handler implementation:`;

  switch (handler.httpMethod) {
    case "GET":
      return `${header}
		// Example implementation:
		// result, err := s.service.${handler.name.slice(0, -7)}(ctx)
		// if err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }
		// w.Header().Set("Content-Type", "application/json")
		// json.NewEncoder(w).Encode(result)`;
    
    case "POST":
      return `${header}
		// Example implementation:
		// var input ${handler.returnType}
		// if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		// 	http.Error(w, "Invalid JSON", http.StatusBadRequest)
		// 	return
		// }
		// result, err := s.service.Create${handler.returnType}(ctx, input)
		// if err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }
		// w.Header().Set("Content-Type", "application/json")
		// w.WriteHeader(http.StatusCreated)
		// json.NewEncoder(w).Encode(result)`;
    
    default:
      return `${header}
		// TODO: Add ${handler.httpMethod} request implementation with body parsing and validation
		w.WriteHeader(http.StatusNotImplemented)
		json.NewEncoder(w).Encode(map[string]string{"message": "Not implemented"})`;
  }
}
