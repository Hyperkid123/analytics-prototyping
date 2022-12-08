package models

import (
	"github.com/google/uuid"
)

// Sessions
type Session struct {
	BaseModel
	SessionID uint         `json:"sessionId"` // Store the UUID for the Session for tracking
	UserRefID uint         `json:"userId"`
	UserRef   *User        `gorm:"foreignKey:UserRefID;references:ID" json:"user"` // Link the Session with a User
	Data      []byte	   `json:"-" gorm:"type:jsonb;column:data"`                // Store additional metadata as a JSON blob
}
