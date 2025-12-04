import {refkey} from "@alloy-js/core"
import {FunctionDeclaration, FunctionReceiver} from "@alloy-js/go"
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
	const serviceRef = refkey(serviceName)

	return (
		<FunctionDeclaration
			name="RegisterRoutes"
			doc="RegisterRoutes registers all handlers with given router"
		>
			<FunctionReceiver name={`s *${serviceName}`} type={undefined}/>
			{`mux *http.ServeMux`}

			{handlers.map(handler => `mux.HandleFunc("${handler.route}", s.${handler.name})`).join('\n\t')}
		</FunctionDeclaration>
	)
}


