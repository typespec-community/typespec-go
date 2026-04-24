/**
 * Integration Test TypeSpec - Complex Scenarios
 * Advanced TypeSpec features for comprehensive E2E testing
 */

import "@typespec/http";

namespace ComplexAPI {
  @error
  model ApiError {
    code: string;
    message: string;
    details?: string[];
  }

  model User {
    @visibility(Lifecycle.Read)
    id: string;
    name: string;
    email: string;
    age?: int32;
    active: boolean;
  }

  model CreateUserRequest {
    @visibility(Lifecycle.Create)
    name: string;
    email: string;
    age?: int32;
  }

  model UserList {
    users: User[];
    total: int32;
  }

  @route("/users")
  @tag("Users")
  interface Users {
    /** Get user by ID */
    @get getUser(@path id: string): User | ApiError;
    
    /** Create new user */
    @post createUser(@body user: CreateUserRequest): User | ApiError;
    
    /** List users with pagination */
    @get listUsers(@query limit?: int32, @query offset?: int32): UserList | ApiError;
    
    /** Update user */
    @patch updateUser(@path id: string, @body user: User): User | ApiError;
    
    /** Delete user */
    @delete deleteUser(@path id: string): void | ApiError;
  }
}

namespace Advanced {
  enum Status {
    pending,
    inProgress: "in_progress",
    completed,
    cancelled,
  }

  union SearchResult {
    user: User,
    message: string,
    error: ApiError,
  }

  model ComplexModel {
    id: string;
    metadata: Record<string>;
    tags: string[];
    createdAt: utcDateTime;
    status: Status;
    result?: SearchResult;
  }
}