export interface GoStringLiteralProps {
  /** The string value (will be properly quoted) */
  value: string;
  /** Whether to use backticks (raw string) instead of double quotes */
  raw?: boolean;
}

/**
 * GoStringLiteral - A Go string literal component
 * 
 * Properly escapes and quotes strings for Go
 * 
 * Example:
 * ```tsx
 * <GoStringLiteral value="Hello, World!" />
 * // Renders as: "Hello, World!"
 * 
 * <GoStringLiteral value="C:\path\to\file" raw />
 * // Renders as: `C:\path\to\file`
 * ```
 */
export function GoStringLiteral(props: GoStringLiteralProps) {
  const { value, raw } = props;
  
  if (raw) {
    return <>{"`" + value + "`"}</>;
  }
  
  // Escape double quotes in the string
  const escaped = value.replace(/"/g, '\\"');
  return <>{'"' + escaped + '"'}</>;
}