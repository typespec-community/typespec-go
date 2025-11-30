package sampleapi

import "time"

// Go types from TypeSpec namespace: SampleAPI
type User struct {
  Id string `json:"id"`
  Email string `json:"email"`
  Name string `json:"name"`
  CreatedAt time.Time `json:"createdAt"`
  UpdatedAt time.Time `json:"updatedAt,omitempty"`
}
// Go types from TypeSpec namespace: SampleAPI
type Task struct {
  Id string `json:"id"`
  Title string `json:"title"`
  Description string `json:"description,omitempty"`
  Status TaskStatus `json:"status"`
  Priority Priority `json:"priority"`
  Assignee User `json:"assignee,omitempty"`
  DueDate time.Time `json:"dueDate,omitempty"`
  CreatedAt time.Time `json:"createdAt"`
}
// Go types from TypeSpec namespace: SampleAPI
type Project struct {
  Id string `json:"id"`
  Name string `json:"name"`
  Description string `json:"description,omitempty"`
  Tasks []Task `json:"tasks"`
  Owner User `json:"owner"`
  Members []User `json:"members"`
}
