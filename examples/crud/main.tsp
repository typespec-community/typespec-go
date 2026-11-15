import "@typespec-community/typespec-go";

using TypeSpec.Go;

@pkg("github.com/acme/orders/api")
namespace Orders;

enum OrderStatus {
  pending,
  confirmed: "confirmed",
  shipped: "shipped",
  cancelled: "cancelled",
}

@enumMode(EnumMode.iota)
enum OrderPriority {
  low,
  normal,
  high,
}

union PaymentMethod {
  creditCard: CreditCard,
  bankTransfer: BankTransfer,
}

model CreditCard {
  last4: string;
  brand: string;
}

model BankTransfer {
  iban: string;
  bankName: string;
}

model Order {
  id: string;
  status: OrderStatus;
  payment?: PaymentMethod;
  total: float64;
  createdAt: utcDateTime;

  @nullable(NullableMode.zeroValue)
  notes?: string;

  @name("OrderReference")
  externalRef?: string;
}

@error
model OrderError {
  message: string;
  code: int32;
}
