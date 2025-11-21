package api

type User struct {
	id string `json:"id"`
	name string `json:"name"`
	email string `json:"email"`
	age int32 `json:"age"`
	score float64 `json:"score"`
	active bool `json:"active"`
	tags Array `json:"tags"`
	metadata []byte `json:"metadata"`
	createdAt time.Time `json:"createdAt"`
}

