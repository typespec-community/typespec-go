package typespec

import "time"import "encoding/json"// Go types from TypeSpec namespace: TypeSpec
type Array struct {

}
// Go types from TypeSpec namespace: TypeSpec
type Record struct {

}
// Go types from TypeSpec namespace: TypeSpec
type OptionalProperties struct {

}
// Go types from TypeSpec namespace: TypeSpec
type UpdateableProperties struct {

}
// Go types from TypeSpec namespace: TypeSpec
type OmitProperties struct {

}
// Go types from TypeSpec namespace: TypeSpec
type PickProperties struct {

}
// Go types from TypeSpec namespace: TypeSpec
type OmitDefaults struct {

}
// Go types from TypeSpec namespace: TypeSpec
type DefaultKeyVisibility struct {

}
// Go types from TypeSpec namespace: TypeSpec
type ServiceOptions struct {
  Title string `json:"title,omitempty"`
}
// Go types from TypeSpec namespace: TypeSpec
type DiscriminatedOptions struct {
  Envelope interface{} `json:"envelope,omitempty"`
  DiscriminatorPropertyName string `json:"discriminatorPropertyName,omitempty"`
  EnvelopePropertyName string `json:"envelopePropertyName,omitempty"`
}
// Go types from TypeSpec namespace: TypeSpec
type ExampleOptions struct {
  Title string `json:"title,omitempty"`
  Description string `json:"description,omitempty"`
}
// Go types from TypeSpec namespace: TypeSpec
type OperationExample struct {
  Parameters interface{} `json:"parameters,omitempty"`
  ReturnType interface{} `json:"returnType,omitempty"`
}
// Go types from TypeSpec namespace: TypeSpec
type VisibilityFilter struct {
  Any Array `json:"any,omitempty"`
  All Array `json:"all,omitempty"`
  None Array `json:"none,omitempty"`
}
// Go types from TypeSpec namespace: TypeSpec
type Create struct {

}
// Go types from TypeSpec namespace: TypeSpec
type Read struct {

}
// Go types from TypeSpec namespace: TypeSpec
type Update struct {

}
// Go types from TypeSpec namespace: TypeSpec
type CreateOrUpdate struct {

}
// Go types from TypeSpec namespace: TypeSpec
type Delete struct {

}
// Go types from TypeSpec namespace: TypeSpec
type Query struct {

}
