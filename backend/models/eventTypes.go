package models

type EventType struct {
	BaseModel
	EventName string  `json:"eventName"`
	Events    []Event `json:"events"`
}
