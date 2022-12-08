package models

import (
	"github.com/google/uuid"
)

// Users
type User struct {
	BaseModel
	UserID uuid.UUID    `json:"userID"`               // Store the internal UUID for that user
	Data   []byte	    `json:"-" gorm:"type:jsonb;column:data"` // Store additional metadata for users
}
