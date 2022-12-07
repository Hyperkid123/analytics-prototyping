package models

import (
    "time"
    "gorm.io/gorm"
    "github.com/jackc/pgtype"
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
    BaseModel
    Journey     *Journey        `gorm:"foreignKey:JourneyID;references:ID" json:"journey"` // Link associated Journeys
    JourneyID   int             `json:"journeyId"` // FK Int
    Session     *Session        `gorm:"foreignKey:SessionID;references:ID" json:"session"` // Link associated Sessions
    SessionID   int             `json:"sessionId"` // FK IN
    Data        pgtype.JSONB    `json:"-" gorm:"column:data"` // Store additional metadata as a JSON blob
}

// Journeys
type Journey struct{
    BaseModel
    Name        string      `json:"name"`
    Status      string      `json:"status"` // ‘cancelled,’ ‘finished,’ ‘in-progress’, ‘not-started?’
    Session     *Session    `gorm:"foreignKey:SessionID;references:ID" json:"session"` // Link associated Sessions
    SessionID   int         `json:"sessionId"` // FK IN
}

// Sessions
type Session struct{
    BaseModel
    SessionID   uint            `json:"sessionId"` // Store the UUID for the Session for tracking
    User        *User           `gorm:"foreignKey:UserID;references:ID" json:"user"` // Link the Session with a User
    UserID      int             `json:"userId"`
    Data        pgtype.JSONB    `json:"-" gorm:"column:data"` // Store additional metadata as a JSON blob
}

// Users
type User struct{
    BaseModel
    UserID  uint         `json:"userID"` // Store the internal UUID for that user
    Data    pgtype.JSONB `json:"-" gorm:"column:data"` // Store additional metadata for users
}
