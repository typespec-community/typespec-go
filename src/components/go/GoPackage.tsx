import { code, stc } from "@alloy-js/core";

export interface GoPackageProps {
  /** Package name for generated Go code */
  name?: string;
  /** Children content */
  children?: any;
}

/**
 * GoPackage - A simple Go package declaration component
 * 
 * Creates proper Go package declaration without requiring complex Go scope
 */
export function GoPackage(props: GoPackageProps) {
  const { name = "main", children } = props;

  // Generate package declaration as code template literal
  return code`package ${name}

${children}`;
}

// STC-wrapped version for JSX compatibility
export const GoPackageSTC = stc(GoPackage);