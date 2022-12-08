package models

import (
	"github.com/google/uuid"
	"github.com/jackc/pgtype"
)

// Sessions
type Session struct {
	BaseModel
	SessionID uuid.UUID    `json:"sessionId"` // Store the UUID for the Session for tracking
	UserRefID uuid.UUID    `json:"userId"`
	UserRef   *User        `gorm:"foreignKey:UserRefID;references:ID" json:"user"` // Link the Session with a User
	Data      pgtype.JSONB `json:"-" gorm:"column:data"`                           // Store additional metadata as a JSON blob
}
