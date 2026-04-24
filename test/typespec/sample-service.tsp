import "@typespec/http";

namespace SampleService {
  /**
   * User model represents a user in the system
   */
  @doc("User information model")
  model User {
    /**
     * Unique identifier for the user
     */
    id: int32;

    /**
     * User's full name
     */
    name: string;

    /**
     * User's email address (optional)
     */
    email?: string;

    /**
     * User's age
     */
    age: int32;

    /**
     * User's status flag
     */
    active: boolean;

    /**
     * User's tags
     */
    tags: string[];

    /**
     * User creation timestamp
     */
    createdAt: utcDateTime;
  }

  /**
   * Product model represents a product in the catalog
   */
  @doc("Product information model")
  model Product {
    id: int32;
    title: string;
    description?: string;
    price: float64;
    category: string;
    inStock: boolean;
    tags: string[];
  }

  /**
   * Order model represents a purchase order
   */
  @doc("Order information model")
  model Order {
    id: string;
    userId: int32;
    productIds: int32[];
    total: float64;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: utcDateTime;
    updatedAt?: utcDateTime;
  }

  /**
   * Response model for list operations
   */
  @doc("Paginated response wrapper")
  model ListResponse<T> {
    data: T[];
    total: int64;
    page: int32;
    pageSize: int32;
  }

  /**
   * Error response model
   */
  @doc("Error response model")
  model ErrorResponse {
    code: string;
    message: string;
    details?: Record<string, string>;
  }

  /**
   * Get all users endpoint
   */
  @route("/users")
  @get
  op listUsers(): ListResponse<User> | ErrorResponse;

  /**
   * Get user by ID endpoint
   */
  @route("/users/{userId}")
  @get
  op getUser(
    @path userId: int32,
    @query includeInactive?: boolean
  ): User | ErrorResponse;

  /**
   * Create new user endpoint
   */
  @route("/users")
  @post
  op createUser(@body user: User): User | ErrorResponse;

  /**
   * Update user endpoint
   */
  @route("/users/{userId}")
  @put
  op updateUser(
    @path userId: int32,
    @body user: User
  ): User | ErrorResponse;

  /**
   * Delete user endpoint
   */
  @route("/users/{userId}")
  @delete
  op deleteUser(@path userId: int32): void | ErrorResponse;

  /**
   * Get all products endpoint
   */
  @route("/products")
  @get
  op listProducts(
    @query category?: string,
    @query page?: int32,
    @query pageSize?: int32
  ): ListResponse<Product> | ErrorResponse;

  /**
   * Get product by ID endpoint
   */
  @route("/products/{productId}")
  @get
  op getProduct(@path productId: int32): Product | ErrorResponse;

  /**
   * Create product endpoint
   */
  @route("/products")
  @post
  op createProduct(@body product: Product): Product | ErrorResponse;

  /**
   * Update product endpoint
   */
  @route("/products/{productId}")
  @put
  op updateProduct(
    @path productId: int32,
    @body product: Product
  ): Product | ErrorResponse;

  /**
   * Get all orders for a user endpoint
   */
  @route("/users/{userId}/orders")
  @get
  op listUserOrders(
    @path userId: int32,
    @query status?: string,
    @query page?: int32
  ): ListResponse<Order> | ErrorResponse;

  /**
   * Create order endpoint
   */
  @route("/orders")
  @post
  op createOrder(@body order: Order): Order | ErrorResponse;

  /**
   * Get order by ID endpoint
   */
  @route("/orders/{orderId}")
  @get
  op getOrder(@path orderId: string): Order | ErrorResponse;

  /**
   * Health check endpoint
   */
  @route("/health")
  @get
  op healthCheck(): {
    status: "healthy" | "unhealthy";
    version: string;
    timestamp: utcDateTime;
  };
}
