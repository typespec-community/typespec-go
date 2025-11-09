import "../dist/src/index.js";

using TypeSpec.Reflection;

namespace TypeSpec.Go;

alias StructTag = Record<string>;

enum NullableMode {
  pointer,
  zeroValue,
  struct,
}

enum EnumMode {
  iota,
  string,
  name,
}

extern dec name(
  target: Model | ModelProperty | Enum | EnumMember | Operation,
  name: valueof string
);

extern dec structTag(target: ModelProperty, tag: valueof string | StructTag);

extern dec nullable(target: ModelProperty, mode: NullableMode);

extern dec type(
  target: Model | ModelProperty | Enum | Scalar,
  type: valueof string
);

extern dec pkg(target: Namespace, path: valueof string);

extern dec enumMode(target: Enum, mode: valueof EnumMode);
