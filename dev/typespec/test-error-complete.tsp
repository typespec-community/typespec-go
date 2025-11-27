@error
model ApiError {
  code: string;
  message: string;
}

@error  
model ValidationError {
  code: "VALIDATION_ERROR";
  message: string;
  details: string[];
}

@error
model NotFoundError {
  code: "NOT_FOUND";
  message: string;
}

@error
model InternalServerError {
  code: "INTERNAL_SERVER_ERROR";
  message: string;
}

model User {
  id: int32;
  name: string;
  email: string;
}

model SuccessResponse {
  user: User;
}

op getUser(id: int32): SuccessResponse | NotFoundError;

op createUser(user: User): SuccessResponse | ValidationError;

op updateUser(id: int32, user: User): SuccessResponse | ValidationError | NotFoundError | InternalServerError;