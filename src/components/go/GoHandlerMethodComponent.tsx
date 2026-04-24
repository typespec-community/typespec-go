import { FunctionDeclaration, FunctionReceiver } from "@alloy-js/go";
import { refkey, code } from "@alloy-js/core";
import type { GoHandlerMethod } from "./GoHandlerMethod";
import type { HttpParameter } from "../../utils/typespec-http-utils";
import { GoStringLiteral, GoSwitch, GoBlock, GoCase, GoDefault } from "./core/index.js";

/**
 * Component for individual handler method generation using 100% Alloy-JS components
 */
export function GoHandlerMethodComponent({
  handler,
  serviceName,
  serviceRef: _serviceRef,
}: {
  handler: GoHandlerMethod;
  serviceName: string;
  serviceRef: ReturnType<typeof refkey>;
}) {
  const serviceInstance = `s.${serviceName.toLowerCase()}`;

  return (
    <FunctionDeclaration
      name={handler.name}
      receiver={<FunctionReceiver name="s" type={`*${serviceName}`} />}
      parameters={[
        { name: "ctx", type: "context.Context" },
        { name: "w", type: "http.ResponseWriter" },
        { name: "r", type: "*http.Request" },
        ...handler.parameters.map((p: HttpParameter) => ({
          name: p.name,
          type: p.goType,
        })),
      ]}
    >
      <GoBlock>
        <GoStringLiteral
          value={`// ${handler.name} - ${handler.doc || `handles ${handler.httpMethod} ${handler.route}`}`}
        />
        <GoStringLiteral value={`// TODO: Implement ${handler.name} handler with business logic`} />
        <GoStringLiteral value={`// Route: ${handler.httpMethod} ${handler.route}`} />
        <GoStringLiteral value="" />
        <GoStringLiteral value="// Handler implementation:" />

        <GoSwitch value={handler.httpMethod}>
          <GoCase value="GET">
            <GoBlock>
              <GoStringLiteral value="		// Example implementation:" />
              <GoStringLiteral
                value={`		// result, err := ${serviceInstance}.${handler.name.slice(0, -7)}(ctx)`}
              />
              <GoStringLiteral value="		// if err != nil {" />
              <GoStringLiteral value="		// 	http.Error(w, err.Error(), http.StatusInternalServerError)" />
              <GoStringLiteral value="		// 	return" />
              <GoStringLiteral value="		// }" />
              <GoStringLiteral>{code`		// w.Header().Set("Content-Type", "application/json")`}</GoStringLiteral>
              <GoStringLiteral value="		// json.NewEncoder(w).Encode(result)" />
            </GoBlock>
          </GoCase>

          <GoCase value="POST">
            <GoBlock>
              <GoStringLiteral value="		// Example implementation:" />
              <GoStringLiteral value={`		// var input ${handler.returnType}`} />
              <GoStringLiteral value="		// if err := json.NewDecoder(r.Body).Decode(&input); err != nil {" />
              <GoStringLiteral>{code`		// 	http.Error(w, "Invalid JSON", http.StatusBadRequest)`}</GoStringLiteral>
              <GoStringLiteral value="		// 	return" />
              <GoStringLiteral value="		// }" />
              <GoStringLiteral
                value={`		// result, err := ${serviceInstance}.Create${handler.returnType}(ctx, input)`}
              />
              <GoStringLiteral value="		// if err != nil {" />
              <GoStringLiteral value="		// 	http.Error(w, err.Error(), http.StatusInternalServerError)" />
              <GoStringLiteral value="		// 	return" />
              <GoStringLiteral value="		// }" />
              <GoStringLiteral>{code`		// w.Header().Set("Content-Type", "application/json")`}</GoStringLiteral>
              <GoStringLiteral value="		// w.WriteHeader(http.StatusCreated)" />
              <GoStringLiteral value="		// json.NewEncoder(w).Encode(result)" />
            </GoBlock>
          </GoCase>

          <GoDefault>
            <GoBlock>
              <GoStringLiteral
                value={`		// TODO: Add ${handler.httpMethod} request implementation with body parsing and validation`}
              />
              <GoStringLiteral value="		w.WriteHeader(http.StatusNotImplemented)" />
              <GoStringLiteral>{code`		json.NewEncoder(w).Encode(map[string]string{"message": "Not implemented"})`}</GoStringLiteral>
            </GoBlock>
          </GoDefault>
        </GoSwitch>
      </GoBlock>
    </FunctionDeclaration>
  );
}
