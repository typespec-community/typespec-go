import "@typespec-community/typespec-go";

model User {
  id: int32;
  name: string;
  email?: string;
  age?: int32;
}