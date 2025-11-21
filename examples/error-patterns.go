// Package: errors - Generated from TypeSpec @error decorator
// This file contains Go native error types implementing the error interface

package errors

import "fmt"

// Error implements the built-in error interface
type Error interface {
    Error() string
}

// ApiError is a base error type for all TypeSpec @error models
type ApiError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
}

// Error returns the error string
func (e *ApiError) Error() string {
    if e == nil {
        return "ApiError: nil"
    }
    return fmt.Sprintf("ApiError[code=%s, message=%s]", e.Code, e.Message)
}

// NewApiError creates a new ApiError with the given code and message
func NewApiError(code string, message string) *ApiError {
    return &ApiError{
        Code:    code,
        Message: message,
    }
}

// ValidationError represents validation errors with details
type ValidationError struct {
    ApiError
    Details []string `json:"details,omitempty"`
}

// Error returns the error string for ValidationError
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
        ApiError: ApiError{
                Code:    code,
                Message: message,
        },
        Details: details,
    }
}

// NotFoundError represents resource not found errors
type NotFoundError struct {
    ApiError
}

// NewNotFoundError creates a new NotFoundError
func NewNotFoundError(message string) *NotFoundError {
    return &NotFoundError{
        ApiError: ApiError{
                Code:    "NOT_FOUND",
                Message: message,
        },
    }
}

// InternalServerError represents server-side errors
type InternalServerError struct {
    ApiError
}

// NewInternalServerError creates a new InternalServerError
func NewInternalServerError(message string) *InternalServerError {
    return &InternalServerError{
        ApiError: ApiError{
                Code:    "INTERNAL_SERVER_ERROR",
                Message: message,
        },
    }
}