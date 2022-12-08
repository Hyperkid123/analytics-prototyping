package models

import "github.com/jackc/pgtype"

// Users
type User struct {
	BaseModel
	UserID uint         `json:"userID"`               // Store the internal UUID for that user
	Data   pgtype.JSONB `json:"-" gorm:"column:data"` // Store additional metadata for users
}
