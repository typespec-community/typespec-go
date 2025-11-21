package main

import (
	"fmt"
)

// Test generated code from TypeSpec @error models

// Error interface (built-in)
type error interface {
	Error() string
}

// ==================== Error Models (generated from @error decorator) ====================

// ApiError represents a TypeSpec @error model
type ApiError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// Error implements built-in error interface
func (e *ApiError) Error() string {
	if e == nil {
		return "ApiError: nil"
	}

	return fmt.Sprintf("ApiError[code=%s, message=%s]", e.Code, e.Message)
}

// NewApiError creates a new ApiError
func NewApiError(code string, message string) *ApiError {
	return &ApiError{
		Code:    code,
		Message: message,
	}
}

// ValidationError represents validation errors with details
type ValidationError struct {
	Code    string   `json:"code"`
	Message string   `json:"message"`
	Details []string `json:"details,omitempty"`
}

// Error implements built-in error interface
func (e *ValidationError) Error() string {
	if e == nil {
		return "ValidationError: nil"
	}
	if e.Details != nil {
		return fmt.Sprintf("ValidationError[code=%s, message=%s, details=%v]", e.Code, e.Message, e.Details)
	}
	return fmt.Sprintf("ValidationError[code=%s, message=%s]", e.Code, e.Message)
}

// NewValidationError creates a new ValidationError
func NewValidationError(code string, message string, details []string) *ValidationError {
	return &ValidationError{
		Code:    code,
		Message: message,
		Details: details,
	}
}

// NotFoundError represents resource not found errors
type NotFoundError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// Error implements built-in error interface
func (e *NotFoundError) Error() string {
	if e == nil {
		return "NotFoundError: nil"
	}

	return fmt.Sprintf("NotFoundError[code=%s, message=%s]", e.Code, e.Message)
}

// NewNotFoundError creates a new NotFoundError
func NewNotFoundError(message string) *NotFoundError {
	return &NotFoundError{
		Code:    "NOT_FOUND",
		Message: message,
	}
}

// InternalServerError represents server-side errors
type InternalServerError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// Error implements built-in error interface
func NewInternalServerError(message string) *InternalServerError {
	return &InternalServerError{
		Code:    "INTERNAL_SERVER_ERROR",
		Message: message,
	}
}

// Error implements built-in error interface
func (e *InternalServerError) Error() string {
	if e == nil {
		return "InternalServerError: nil"
	}

	return fmt.Sprintf("InternalServerError[code=%s, message=%s]", e.Code, e.Message)
}



// ==================== Regular Models ====================

// User model
type User struct {
	ID    int32  `json:"id"`
	Name  string  `json:"name"`
	Email string  `json:"email"`
}

// SuccessResponse model
type SuccessResponse struct {
	User User `json:"user"`
}

// ==================== Function Examples ====================

// Example operation that can return success or error
func getUser(id int32) (SuccessResponse, error) {
	// Simulate user lookup
	if id == 404 {
		return SuccessResponse{}, NewNotFoundError("User not found")
	}
	
	// Return success case
	return SuccessResponse{
		User: User{
			ID:    id,
			Name:  "John Doe",
			Email: "john@example.com",
		},
	}, nil
}

// Example operation with validation error
func createUser(user User) (SuccessResponse, error) {
	// Validate user
	if user.Name == "" {
		return SuccessResponse{}, NewValidationError("VALIDATION_ERROR", "Name is required", []string{"Name cannot be empty"})
	}
	
	// Simulate user creation
	createdUser := User{
		ID:    123,
		Name:  user.Name,
		Email: user.Email,
	}
	
	return SuccessResponse{User: createdUser}, nil
}

// ==================== Usage Example ====================

func main() {
	// Test getUser with valid ID
	user, err := getUser(1)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Success: %+v\n", user)
	}
	
	// Test getUser with invalid ID (404)
	user, err = getUser(404)
	if err != nil {
		fmt.Printf("Expected Error: %v\n", err)
		
		// Error unwrapping example
		if validationErr, ok := err.(*ValidationError); ok {
			fmt.Printf("Validation Error Details: %v\n", validationErr.Details)
		} else if notFoundErr, ok := err.(*NotFoundError); ok {
			fmt.Printf("Not Found Error Code: %s\n", notFoundErr.Code)
		}
	}
	
	// Test createUser with invalid data
	invalidUser := User{Email: "test@example.com"}
	_, err = createUser(invalidUser)
	if err != nil {
		fmt.Printf("Validation Error: %v\n", err)
		
		// Type assertion example
		if validationErr, ok := err.(*ValidationError); ok {
			fmt.Printf("Validation failed with %d details\n", len(validationErr.Details))
		}
	}
}