import "@typespec-community/typespec-go";

model User {
  id: int32;
  name: string;
  email?: string;
  age?: int32;
}

model Product {
  id: int32;
  title: string;
  price: float64;
  description?: string;
}