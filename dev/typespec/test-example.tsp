model User {
  id: string;
  name: string;
  email?: string;
  age: uint8;
  active: bool;
  loginCount: uint32;
  score: float32;
}

model Product {
  productID: uint32;
  productName: string;
  price: float64;
  inStock: bool;
  quantity: uint16;
}