package sampleapi

import (
	"encoding/json"
	"fmt"
)

// NotificationType is a sealed interface representing a union type
type NotificationType interface {
	isNotificationType()
	GetType() string
}

// Email implements NotificationType
type Email struct {
	Type string `json:"type"`
	Value interface{} `json:"value,omitempty"`
}

func (Email) isNotificationType() {}
func (v Email) GetType() string { return "email" }

// Sms implements NotificationType
type Sms struct {
	Type string `json:"type"`
	Value interface{} `json:"value,omitempty"`
}

func (Sms) isNotificationType() {}
func (v Sms) GetType() string { return "sms" }

// Push implements NotificationType
type Push struct {
	Type string `json:"type"`
	Value interface{} `json:"value,omitempty"`
}

func (Push) isNotificationType() {}
func (v Push) GetType() string { return "push" }

// UnmarshalNotificationType unmarshals JSON into the appropriate variant
func UnmarshalNotificationType(data []byte) (NotificationType, error) {
	var base struct { Type string `json:"type"` }
	if err := json.Unmarshal(data, &base); err != nil {
		return nil, err
	}

	switch base.Type {
	case "email":
		var v Email
		if err := json.Unmarshal(data, &v); err != nil {
			return nil, err
		}
		return v, nil
	case "sms":
		var v Sms
		if err := json.Unmarshal(data, &v); err != nil {
			return nil, err
		}
		return v, nil
	case "push":
		var v Push
		if err := json.Unmarshal(data, &v); err != nil {
			return nil, err
		}
		return v, nil
	default:
		return nil, fmt.Errorf("unknown NotificationType type: %s", base.Type)
	}
}
