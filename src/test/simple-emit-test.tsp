import "@typespec-community/typespec-go";

model SimpleUser {
  id: int32;
  name: string;
  email?: string;
}