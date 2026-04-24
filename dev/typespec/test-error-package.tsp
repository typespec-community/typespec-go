@error
model ValidationError {
  code: string;
  message: string;
  details?: string[];
}

@error
model NotFoundError {
  code: string;
  message: string;
}

model User {
  id: int32;
  name: string;
  email: string;
}

op getUser(id: int32): User | NotFoundError;
op createUser(user: User): User | ValidationError;