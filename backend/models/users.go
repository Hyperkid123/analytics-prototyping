package models

import (
	"github.com/google/uuid"
	"github.com/jackc/pgtype"
)

// Users
type User struct {
	BaseModel
	UserID uuid.UUID    `json:"userID"`               // Store the internal UUID for that user
	Data   pgtype.JSONB `json:"-" gorm:"column:data"` // Store additional metadata for users
}
