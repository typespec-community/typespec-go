import * as go from "@alloy-js/go";
const { StringExpression } = go;

export interface GoIfProps {
  /** The condition to test */
  condition: string | any;
  /** The code to render when condition is true */
  children: any;
  /** Optional else clause */
  else?: any;
}

/**
 * GoIf - A Go if statement component using Alloy-JS Go components
 */
export function GoIf(props: GoIfProps) {
  const content = props.else 
    ? `if ${props.condition} {
${props.children}
} else {
${props.else}
}`
    : `if ${props.condition} {
${props.children}
}`;
  return <StringExpression value={content} />;
}

/**
 * GoElseIf - An else-if clause
 */
export function GoElseIf(props: { condition: string | any; children: any }) {
  return <StringExpression value={`else if ${props.condition} {
${props.children}
}`} />;
}