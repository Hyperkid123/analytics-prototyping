package models

import (
    "time"
    "gorm.io/gorm"
    "github.com/google/uuid"
)

// Generic Struct used throughout models in this service.
type BaseModel struct {
    ID        uuid.UUID      `gorm:"primarykey" json:"id,omitempty"`
    CreatedAt time.Time      `json:"createdAt,omitempty"`
    UpdatedAt time.Time      `json:"updatedAt,omitempty"`
    DeletedAt gorm.DeletedAt `json:"deletedAt,omitempty"`
}

// Users
type User struct{
    BaseModel
    UserID  uuid.UUID       `json:"userID"` // Store the internal UUID for that user
    Data    []byte          `json:"-" gorm:"type:jsonb;column:data"` // Store additional metadata for users
}

// Sessions
type Session struct{
    BaseModel
    SessionID    uuid.UUID       `json:"sessionId"` // Store the UUID for the Session for tracking
    UserRefID    int             `json:"userId"`
    UserRef     *User            `gorm:"foreignKey:UserRefID;references:ID" json:"user"` // Link the Session with a User
    Data         []byte          `json:"-" gorm:"type:jsonb;column:data"` // Store additional metadata as a JSON blob
}

// Journeys
type Journey struct{
    BaseModel
    Name            string      `json:"name"`
    Status          string      `json:"status"` // ‘cancelled,’ ‘finished,’ ‘in-progress’, ‘not-started?’
    SessionRefID    int         `json:"sessionId"` // FK IN
    SessionRef     *Session     `gorm:"foreignKey:SessionRefID;references:ID" json:"session"` // Link associated Sessions
}

// Events
type Event struct{
    BaseModel
    JourneyRefID    int             `json:"journeyId"` // FK Int
    Journey        *Journey         `gorm:"foreignKey:JourneyRefID;references:ID" json:"journey"` // Link associated Journeys
    SessionRefID    int             `json:"sessionId"` // FK IN
    SessionRef     *Session         `gorm:"foreignKey:SessionRefID;references:ID" json:"session"` // Link associated Sessions
    Data           []byte           `json:"-" gorm:"type:jsonb;column:data"` // Store additional metadata as a JSON blob
}
