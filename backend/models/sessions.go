package models

import "github.com/jackc/pgtype"

// Sessions
type Session struct {
	BaseModel
	SessionID uint         `json:"sessionId"` // Store the UUID for the Session for tracking
	UserRefID int          `json:"userId"`
	UserRef   *User        `gorm:"foreignKey:UserRefID;references:ID" json:"user"` // Link the Session with a User
	Data      pgtype.JSONB `json:"-" gorm:"column:data"`                           // Store additional metadata as a JSON blob
}
