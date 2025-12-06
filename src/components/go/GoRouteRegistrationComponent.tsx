import { FunctionDeclaration, FunctionParameter, FunctionReceiver } from "@alloy-js/go";
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
      doc="RegisterRoutes registers all handlers with given router"
    >
      <FunctionReceiver name="s" type={`*${serviceName}`} />
      {handlers.map(
        (handler: GoHandlerMethod) => (
          <>
            mux.HandleFunc(
            <GoStringLiteral value={handler.route} />
            , s.{handler.name})
          </>
        ),
      )}
    </FunctionDeclaration>
  );
}
