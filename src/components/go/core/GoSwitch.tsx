import * as go from "@alloy-js/go";
const { StringExpression } = go;

export interface GoSwitchCaseProps {
  /** The value or condition to match */
  when?: string | any;
  /** Whether this is a default case */
  default?: boolean;
  /** The code to render for this case */
  children: any;
}

/**
 * GoSwitchCase - Represents a case in a Go switch statement using Alloy-JS Go components
 */
export function GoSwitchCase(props: GoSwitchCaseProps) {
  return <>{props.children || ""}</>;
}

export interface GoSwitchProps {
  /** The expression to switch on */
  value: string | any;
  /** The cases - should be GoSwitchCase components */
  children: any;
}

/**
 * GoSwitch - A Go switch statement component using Alloy-JS Go components
 */
export function GoSwitch(props: GoSwitchProps) {
  return <StringExpression value={`switch ${props.value} {
${props.children}
}`} />;
}

/**
 * GoCase - A case clause in a switch statement using Alloy-JS Go components
 */
export function GoCase(props: { value: string | any; children: any }) {
  return <StringExpression value={`case ${props.value}:
${props.children}`} />;
}

/**
 * GoDefault - The default clause in a switch statement using Alloy-JS Go components
 */
export function GoDefault(props: { children: any }) {
  return <StringExpression value={`default:
${props.children}`} />;
}