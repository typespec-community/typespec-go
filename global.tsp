/**
 * Global TypeSpec Test File
 * Used for integration testing of TypeSpec Go emitter
 */

namespace GlobalAPI {
  model GlobalUser {
    id: string;
    name: string;
    email?: string;
    age?: int32;
  }

  model GlobalProduct {
    id: string;
    name: string;
    price: float64;
    description?: string;
  }

  model GlobalOrder {
    id: string;
    userId: string;
    productId: string;
    quantity: int32;
    totalPrice: float64;
    status: OrderStatus;
  }

  enum OrderStatus {
    pending: "pending";
    processing: "processing";
    shipped: "shipped";
    delivered: "delivered";
    cancelled: "cancelled";
  }
}