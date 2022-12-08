package models

import "github.com/google/uuid"

// Journeys
type Journey struct {
	BaseModel
	Name         string    `json:"name"`
	Status       string    `json:"status"`                                               // ‘cancelled,’ ‘finished,’ ‘in-progress’, ‘not-started?’
	SessionRefID uuid.UUID `json:"sessionId"`                                            // FK IN
	SessionRef   *Session  `gorm:"foreignKey:SessionRefID;references:ID" json:"session"` // Link associated Sessions
}
