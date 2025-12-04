import {HttpParameter} from "../../utils/typespec-http-utils"
import {JSX} from "@alloy-js/core/jsx-runtime"
import type {Operation} from "@typespec/compiler"

export interface GoHandlerMethod {
	/** Handler function name */
	name: string;
	/** HTTP method (GET, POST, etc.) */
	httpMethod: string;
	/** Route path */
	route: string;
	/** Method parameters */
	parameters: HttpParameter[];
	/** Return type */
	returnType: string | JSX.Element;
	/** Documentation comment */
	doc?: string;
	/** TypeSpec operation for refkey tracking */
	operation?: Operation;
}
