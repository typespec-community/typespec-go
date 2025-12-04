// Removed Match import - replacing with conditional logic
import {FunctionDeclaration} from "@alloy-js/go"
import {SingleLineCommentBlock} from "@alloy-js/typescript"
import {refkey} from "@alloy-js/core"
import {GoHandlerMethod} from "./GoHandlerMethod"

/**
 * Component for individual handler method generation
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
	return (
		<>
			{/* Handler documentation */}
			<SingleLineCommentBlock>{handler.name} {handler.doc || `handles ${handler.httpMethod} ${handler.route}`}</SingleLineCommentBlock>

			{/* Function signature */}
			<FunctionDeclaration
				name={handler.name}
				receiver={`s *${serviceName}`}
				parameters={handler.parameters.map(p => ({
					name: p.name,
					type: p.goType,
				}))}
				returnType=""
			>
				{/* Handler implementation placeholder */}
				{`\t// TODO: Implement ${handler.name} handler with business logic
\t// Route: ${handler.httpMethod} ${handler.route}

`}

				{`// Handler implementation:`}
				{handler.httpMethod === "GET" ? 
					`\t// Example implementation:
\t// result, err := s.service.${handler.name.slice(0, -7)}(ctx)
\t// if err != nil {
\t// \thttp.Error(w, err.Error(), http.StatusInternalServerError)
\t// \treturn
\t// }
\t// w.Header().Set("Content-Type", "application/json")
\t// json.NewEncoder(w).Encode(result)
` : 
				handler.httpMethod === "POST" ?
					`\t// Example implementation:
\t// var input ${handler.returnType}
\t// if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
\t// \thttp.Error(w, "Invalid JSON", http.StatusBadRequest)
\t// \treturn
\t// }
\t// result, err := s.service.Create${handler.returnType}(ctx, input)
\t// if err != nil {
\t// \thttp.Error(w, err.Error(), http.StatusInternalServerError)
\t// \treturn
\t// }
\t// w.Header().Set("Content-Type", "application/json")
\t// w.WriteHeader(http.StatusCreated)
\t// json.NewEncoder(w).Encode(result)
` :
					`\t// TODO: Add ${handler.httpMethod} request implementation with body parsing and validation
\tw.WriteHeader(http.StatusNotImplemented)
\tjson.NewEncoder(w).Encode(map[string]string{"message": "Not implemented"})
`
				}
				
			</FunctionDeclaration>

			{`\n`}
		</>
	)
}
