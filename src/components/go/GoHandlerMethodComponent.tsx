import { code } from "@alloy-js/core";
import { FunctionDeclaration, FunctionReceiver } from "@alloy-js/go";
import type { GoHandlerMethod } from "./GoHandlerMethod.js";
import type { HttpParameter } from "../../utils/typespec-http-utils.js";

/**
 * Component for individual handler method generation using 100% Alloy-JS components
 */
export function GoHandlerMethodComponent({
  handler,
  serviceName,
}: {
  handler: GoHandlerMethod;
  serviceName: string;
}) {
  return (
    <FunctionDeclaration
      name={handler.name}
      receiver={<FunctionReceiver name="s" type={`*${serviceName}`} />}
      parameters={handler.parameters.map((p: HttpParameter) => ({
        name: p.name,
        type: p.goType,
      }))}
    >
      {code`
        // ${handler.name} handles ${handler.httpMethod} ${handler.route}
        // TODO: Implement ${handler.name} with business logic
        w.WriteHeader(http.StatusNotImplemented)
      `}
    </FunctionDeclaration>
  );
}
