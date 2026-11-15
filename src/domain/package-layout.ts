/**
 * Package file-layout builder: the pure decisions behind a generated Go
 * package (which files exist, which imports they need, the Service/API
 * identifiers) separated from the components that render them.
 */

import type { Enum, Model, Operation, Type, Union } from "@typespec/compiler";
import { capitalize } from "../utils/strings.js";

const TIME_SCALAR_NAMES = new Set([
  "plaindate",
  "plaintime",
  "utcdatetime",
  "offsetdatetime",
  "duration",
]);

function isTimeType(type: Type): boolean {
  if (type.kind !== "Scalar") return false;
  const scalarName = type.name?.toLowerCase() || "";
  return TIME_SCALAR_NAMES.has(scalarName);
}

function hasTimeScalarProperty(model: Model): boolean {
  if (!model.properties) return false;
  for (const prop of model.properties.values()) {
    if (isTimeType(prop.type)) {
      return true;
    }
  }
  return false;
}

/** Which optional files and imports a package needs (models.go is always emitted). */
export interface PackageFileLayout {
  /** Module directory name (module path when set, else a placeholder root) */
  moduleDirectory: string;
  /** Handler struct name, e.g. `CrudService` */
  serviceName: string;
  /** Contract interface name, e.g. `CrudAPI` */
  apiInterfaceName: string;
  files: {
    enums: boolean;
    handlers: boolean;
    interfaces: boolean;
    unions: boolean;
  };
  imports: {
    /** models.go needs `time` (a model has a time-typed property) */
    modelsTime: boolean;
    /** unions.go needs `encoding/json` + `fmt` (every union renders an unmarshaler) */
    unionsJsonFmt: boolean;
  };
}

export function buildPackageFileLayout(input: {
  packageName: string;
  modulePath?: string;
  models: Model[];
  enums: Enum[];
  unions: Union[];
  operations: Operation[];
}): PackageFileLayout {
  const { packageName, modulePath, models, enums, unions, operations } = input;
  const hasOperations = operations.length > 0;

  return {
    moduleDirectory: modulePath ?? "github.com/yourcompany/" + packageName,
    serviceName: capitalize(packageName) + "Service",
    apiInterfaceName: capitalize(packageName) + "API",
    files: {
      enums: enums.length > 0,
      handlers: hasOperations,
      interfaces: hasOperations,
      unions: unions.length > 0,
    },
    imports: {
      modelsTime: models.some(hasTimeScalarProperty),
      unionsJsonFmt: unions.length > 0,
    },
  };
}
