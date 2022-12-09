package models

import (
	"github.com/google/uuid"
)

// Events
type Event struct {
	BaseModel
	JourneyRefID uuid.UUID    `json:"journeyId"`                                            // FK Int
	Journey      *Journey     `gorm:"foreignKey:JourneyRefID;references:ID" json:"journey"` // Link associated Journeys
	SessionRefID uuid.UUID    `json:"sessionId"`                                            // FK IN
	SessionRef   *Session     `gorm:"foreignKey:SessionRefID;references:ID" json:"session"` // Link associated Sessions
	Data         []byte  	  `json:"-" gorm:"type:jsonb;column:data"`                                 // Store additional metadata as a JSON blob
}
