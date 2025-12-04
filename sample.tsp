/**
 * Sample TypeSpec Test File
 * Comprehensive example for TypeSpec Go emitter testing
 */

using TypeSpec.Http

namespace SampleAPI {
  @doc("User model with comprehensive fields")
  model User {
    id: string;
    name: string;
    email?: string;
    age?: int32;
    isActive: boolean = true;
    roles: Role[];
    address?: Address;
    metadata?: Record<unknown>;
  }

  @doc("Role model for user permissions")
  model Role {
    id: string;
    name: string;
    permissions: Permission[];
    description?: string;
  }

  @doc("Permission model")
  model Permission {
    id: string;
    resource: string;
    action: string;
    conditions?: Record<string>;
  }

  @doc("Address model")
  model Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: Coordinates;
  }

  @doc("Geographic coordinates")
  model Coordinates {
    latitude: float64;
    longitude: float64;
    accuracy?: float32;
  }

  @doc("User creation request")
  model CreateUserRequest {
    name: string;
    email: string;
    age?: int32;
    address?: Address;
    initialRoles?: string[];
  }

  @doc("User update request")
  model UpdateUserRequest {
    name?: string;
    email?: string;
    age?: int32;
    address?: Address;
    isActive?: boolean;
  }

  @doc("User response")
  model UserResponse {
    id: string;
    name: string;
    email?: string;
    age?: int32;
    isActive: boolean;
    roles: Role[];
    address?: Address;
    createdAt: utcDateTime;
    updatedAt: utcDateTime;
  }

  @doc("Error response")
  model ErrorResponse {
    error: string;
    message: string;
    details?: Record<unknown>;
    correlationId?: string;
  }

  @doc("API response wrapper")
  model ApiResponse<T> {
    data?: T;
    error?: ErrorResponse;
    success: boolean;
    timestamp: utcDateTime;
  }

  @doc("API response with pagination")
  model PaginatedResponse<T> {
    data: T[];
    pagination: PaginationInfo;
    success: boolean;
    timestamp: utcDateTime;
  }

  @doc("Pagination information")
  model PaginationInfo {
    page: int32;
    pageSize: int32;
    total: int64;
    totalPages: int32;
    hasNext: boolean;
    hasPrevious: boolean;
  }

  @doc("User status enumeration")
  enum UserStatus {
    active: "active";
    inactive: "inactive";
    suspended: "suspended";
    pending: "pending";
  }

  @doc("HTTP status code")
  enum HttpStatus {
    OK: 200;
    Created: 201;
    BadRequest: 400;
    Unauthorized: 401;
    Forbidden: 403;
    NotFound: 404;
    InternalServerError: 500;
  }

  @doc("Complex union type for search results")
  union SearchResult = User | Product | Order;

  @doc("Product model")
  model Product {
    id: string;
    name: string;
    description?: string;
    price: float64;
    category: string;
    tags?: string[];
    available: boolean = true;
    createdAt: utcDateTime;
    updatedAt: utcDateTime;
  }

  @doc("Order model")
  model Order {
    id: string;
    userId: string;
    items: OrderItem[];
    status: OrderStatus;
    totalAmount: float64;
    shippingAddress: Address;
    billingAddress?: Address;
    createdAt: utcDateTime;
    updatedAt: utcDateTime;
  }

  @doc("Order item model")
  model OrderItem {
    productId: string;
    quantity: int32;
    unitPrice: float64;
    totalPrice: float64;
    product?: Product;
  }

  @doc("Order status enumeration")
  enum OrderStatus {
    pending: "pending";
    processing: "processing";
    shipped: "shipped";
    delivered: "delivered";
    cancelled: "cancelled";
    refunded: "refunded";
  }

  @doc("Task status enumeration")
  enum TaskStatus {
    pending,
    inProgress: "in_progress";
    completed: "completed";
    cancelled: "cancelled";
  }

  @doc("Task priority enumeration")
  enum Priority {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  }

  @doc("Complex notification type union")
  union NotificationType = 
    | { email: string, subject?: string }
    | { sms: string, countryCode?: string }
    | { push: string, deviceToken: string };

  @doc("Task model for project management")
  model Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    assignee?: User;
    dueDate?: plainDate;
    createdAt: utcDateTime;
    updatedAt: utcDateTime;
  }

  @doc("Email notification model")
  model EmailNotification {
    to: string;
    subject: string;
    body: string;
    from?: string;
  }

  @doc("Push notification model")
  model PushNotification {
    deviceToken: string;
    title: string;
    message: string;
    payload?: Record<unknown>;
  }

  @doc("SMS notification model")
  model SMSNotification {
    phoneNumber: string;
    message: string;
    countryCode?: string = "+1";
  }

  @doc("User service operations")
  @route("/users")
  interface UserService {
    @get("/{id}")
    getUser(id: string): ApiResponse<UserResponse>;

    @post("/")
    createUser(@body request: CreateUserRequest): ApiResponse<UserResponse>;

    @put("/{id}")
    updateUser(id: string, @body request: UpdateUserRequest): ApiResponse<UserResponse>;

    @delete("/{id}")
    deleteUser(id: string): ApiResponse<void>;

    @get("/")
    listUsers(@query page: int32 = 1, @query pageSize: int32 = 20): PaginatedResponse<UserResponse>;
  }
}