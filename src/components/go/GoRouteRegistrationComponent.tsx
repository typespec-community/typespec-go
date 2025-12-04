import {For, StatementList} from "@alloy-js/core"
import {GoHandlerMethod} from "./GoHandlerMethod"
import {SingleLineCommentBlock} from "@alloy-js/typescript"

type GoRouteRegistrationComponentProps = {
	handlers: GoHandlerMethod[];
	serviceName: string;
}

/**
 * Component for route registration function
 */
export function GoRouteRegistrationComponent({handlers, serviceName}: GoRouteRegistrationComponentProps) {
	return <>
		<SingleLineCommentBlock>RegisterRoutes registers all handlers with given router</SingleLineCommentBlock>
		{`func (s *${serviceName}) RegisterRoutes(mux *http.ServeMux) {
`}

		<For each={handlers}>
			{(handler: GoHandlerMethod) => <StatementList>
				{`\tmux.HandleFunc("${handler.route}", s.${handler.name})`}
			</StatementList>}
		</For>

		{`}
`}
	</>
}


