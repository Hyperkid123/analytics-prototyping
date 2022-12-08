package models

import "github.com/jackc/pgtype"

// Events
type Event struct {
	BaseModel
	JourneyRefID int          `json:"journeyId"`                                            // FK Int
	Journey      *Journey     `gorm:"foreignKey:JourneyRefID;references:ID" json:"journey"` // Link associated Journeys
	SessionRefID int          `json:"sessionId"`                                            // FK IN
	SessionRef   *Session     `gorm:"foreignKey:SessionRefID;references:ID" json:"session"` // Link associated Sessions
	Data         pgtype.JSONB `json:"-" gorm:"column:data"`                                 // Store additional metadata as a JSON blob
}
