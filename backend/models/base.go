package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Generic Struct used throughout models in this service.
type BaseModel struct {
	ID        uuid.UUID      `gorm:"primarykey" json:"id,omitempty"`
	CreatedAt time.Time      `json:"createdAt,omitempty"`
	UpdatedAt time.Time      `json:"updatedAt,omitempty"`
	DeletedAt gorm.DeletedAt `json:"deletedAt,omitempty"`
}
