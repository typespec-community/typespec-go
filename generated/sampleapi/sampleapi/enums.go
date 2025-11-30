package sampleapi

type TaskStatus string

const (
	TaskStatusPending TaskStatus = "pending"
	TaskStatusInProgress TaskStatus = "in_progress"
	TaskStatusCompleted TaskStatus = "completed"
	TaskStatusCancelled TaskStatus = "cancelled"
)

func (e TaskStatus) String() string {
	return string(e)
}

func (e TaskStatus) IsValid() bool {
	switch e {
	case TaskStatusPending, TaskStatusInProgress, TaskStatusCompleted, TaskStatusCancelled:
		return true
	default:
		return false
	}
}
type Priority int

const (
	PriorityLow Priority = 0
	PriorityMedium Priority = 1
	PriorityHigh Priority = 2
	PriorityCritical Priority = 3
)

func (e Priority) IsValid() bool {
	switch e {
	case PriorityLow, PriorityMedium, PriorityHigh, PriorityCritical:
		return true
	default:
		return false
	}
}
