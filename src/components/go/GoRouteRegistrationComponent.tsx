import {refkey} from "@alloy-js/core"
import {FunctionDeclaration, FunctionReceiver, FunctionParameter} from "@alloy-js/go"
import {GoHandlerMethod} from "./GoHandlerMethod"

type GoRouteRegistrationComponentProps = {
	handlers: GoHandlerMethod[];
	serviceName: string;
}

/**
 * Component for route registration function
 * 100% Alloy native Go function generation
 */
export function GoRouteRegistrationComponent({handlers, serviceName}: GoRouteRegistrationComponentProps) {
	return (
		<FunctionDeclaration
			name="RegisterRoutes"
			doc="RegisterRoutes registers all handlers with given router"
		>
			<FunctionReceiver name={`s *${serviceName}`} type={undefined}/>
			<FunctionParameter name="mux" type="*http.ServeMux"/>

			{handlers.map((handler: GoHandlerMethod) => (
				`mux.HandleFunc("${handler.route}", s.${handler.name})`
			))}
		</FunctionDeclaration>
	)
}


