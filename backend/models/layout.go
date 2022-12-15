package models

import (
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

// Events
type Layout struct {
	BaseModel
	UserRef uuid.UUID      `json:"userID" gorm:"foreignKey:UserID"`
	Data    datatypes.JSON `json:"data" gorm:"type:JSONB;column:data"` // Store additional metadata as a JSON blob
}
