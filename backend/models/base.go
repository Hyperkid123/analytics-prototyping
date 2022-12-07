package models

import (
    "time"
    "errors"
    "gorm.io/gorm"
    "database/sql/driver"
    "encoding/json"
)

// Generic Struct used throughout models in this service.
type BaseModel struct {
    ID        uint           `gorm:"primarykey" json:"id,omitempty"`
    CreatedAt time.Time      `json:"createdAt,omitempty"`
    UpdatedAt time.Time      `json:"updatedAt,omitempty"`
    DeletedAt gorm.DeletedAt `json:"deletedAt,omitempty"`
}

// Events
type Event struct{
    base
    Journey     Journey `json:"journey"` // Link associated Journeys
    Session     Session `json:"session"` // Link associated Sessions
    Data        JSONB   `json:"data"` // Store additional metadata as a JSON blob
}

// Journeys
type Journey struct{
    base
    Name        string  `json:"name"`
    Status      string  `json:"status"` // ‘cancelled,’ ‘finished,’ ‘in-progress’, ‘not-started?’
    Session     Session `json:"session"` // Link a Journey to a specific User Session
}

// Sessions
type Session struct{
    base
    SessionID   uint    `json:"sessionID"` // Store the UUID for the Session for tracking
    User        User    `json:"user"` // Link the Session with a User
    Data        JSONB   `gorm:"type:jsonb" json:"data"` // Store additional metadata as a JSON blob
}

// Users
type User struct{
    base
    UserID  uint    `json:"userID"` // Store the internal UUID for that user
    Data    JSONB   `gorm:"type:jsonb" json:"data"` // Store additional metadata for users
}
