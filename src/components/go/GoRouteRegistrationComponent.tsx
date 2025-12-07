import { FunctionDeclaration, FunctionReceiver } from "@alloy-js/go";
import type { GoHandlerMethod } from "./GoHandlerMethod";
import { GoStringLiteral } from "./core/index.js";

type GoRouteRegistrationComponentProps = {
  handlers: GoHandlerMethod[];
  serviceName: string;
};

/**
 * Component for route registration function
 * 100% Alloy native Go function generation
 */
export function GoRouteRegistrationComponent({
  handlers,
  serviceName,
}: GoRouteRegistrationComponentProps) {
  return (
    <FunctionDeclaration
      name="RegisterRoutes"
      receiver={<FunctionReceiver name="s" type={`*${serviceName}`} />}
      doc="RegisterRoutes registers all handlers with given router"
      parameters={[{ name: "mux", type: "*http.ServeMux" }]}
    >
      {handlers.map((handler: GoHandlerMethod) => (
        <GoStringLiteral value={`mux.HandleFunc("${handler.route}", s.${handler.name})`} />
      ))}
    </FunctionDeclaration>
  );
}
