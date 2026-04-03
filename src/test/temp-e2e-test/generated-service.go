// Generated Go Service from TypeSpec
// This demonstrates the complete workflow with branded types

package testapi

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/larsartmann/go-composable-business-types/enums"
	"github.com/larsartmann/go-composable-business-types/id"
	"github.com/larsartmann/go-composable-business-types/types"
)

// Strong ID type aliases for type safety
type (
	IDID = id.ID[UserBrand, string]
	IdID = id.ID[GetUserHandlerBrand, string]
)

// Brand types for strong ID generics
type (
	UserBrand           struct{}
	GetUserHandlerBrand struct{}
)

// Domain type aliases (phantom types for type safety)
type (
	Age          = types.Age
	TotalInt     = types.TotalInt
	ActiveStatus = enums.ActiveStatus
)

// Type: User from TypeSpec
type User struct {
	ID     IDID         `json:"id"`
	Name   string       `json:"name"`
	Email  types.Email  `json:"email,omitempty"`
	Age    Age          `json:"age"`
	Active ActiveStatus `json:"active"`
}

// Type: CreateUserRequest from TypeSpec
type CreateUserRequest struct {
	Name  string      `json:"name"`
	Email types.Email `json:"email"`
	Age   Age         `json:"age"`
}

// Type: UserList from TypeSpec
type UserList struct {
	Users []User   `json:"users"`
	Total TotalInt `json:"total"`
}

// Service: TestAPI from TypeSpec
type TestAPIService struct {
	// Service dependencies here
}

// Interface: Generated from TypeSpec operations
type TestAPIServiceInterface interface {
	GetUser(ctx context.Context, id IdID) (User, error)
	CreateUser(ctx context.Context, user CreateUserRequest) (User, error)
	ListUsers(ctx context.Context, limit, offset *int32) (UserList, error)
	UpdateUser(ctx context.Context, id IdID, user User) (User, error)
	DeleteUser(ctx context.Context, id IdID) error
}

// Handler: GetUser from TypeSpec operation
func (s *TestAPIService) GetUserHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, id IdID) {
	// TODO: Implement GetUser handler
	// Route: GET /users/{id}

	result, err := s.service.GetUser(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// Handler: CreateUser from TypeSpec operation
func (s *TestAPIService) CreateUserHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	// TODO: Implement CreateUser handler
	// Route: POST /users

	var input CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	result, err := s.service.CreateUser(ctx, input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// Route Registration: Generated from TypeSpec operations
func (s *TestAPIService) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/users/{id}", s.GetUserHandler)
	mux.HandleFunc("/users", s.CreateUserHandler)
	mux.HandleFunc("/users", s.ListUsersHandler)
	mux.HandleFunc("/users/{id}", s.UpdateUserHandler)
	mux.HandleFunc("/users/{id}", s.DeleteUserHandler)
}
