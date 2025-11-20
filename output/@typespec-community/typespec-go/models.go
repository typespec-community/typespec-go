package api

type User struct {
	id string `json:"id"`
	name string `json:"name"`
	email string `json:"email"`
	age int32 `json:"age"`
	active bool `json:"active"`
}

