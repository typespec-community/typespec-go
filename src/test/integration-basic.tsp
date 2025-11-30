/**
 * Integration Test TypeSpec - Basic Models and Operations
 * Real TypeSpec file for E2E testing of Go emitter
 */

namespace TestAPI {
  model User {
    id: string;
    name: string;
    email?: string;
    age: int32;
    active: boolean;
  }

  model CreateUserRequest {
    name: string;
    email: string;
    age: int32;
  }

  model UserList {
    users: User[];
    total: int32;
  }

  op getUser(@path id: string): User;
  op createUser(@body user: CreateUserRequest): User;
  op listUsers(@query limit?: int32, @query offset?: int32): UserList;
  op updateUser(@path id: string, @body user: User): User;
  op deleteUser(@path id: string): void;
}

namespace Utils {
  model Config {
    debug: boolean;
    timeout: duration;
    version: string;
  }
}