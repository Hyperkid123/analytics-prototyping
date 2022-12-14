package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Users
type User struct {
	BaseModel                // Store the internal ID for that user
	UserID    string         `json:"userID" gorm:"unique;type:text"`
	Events    []Event        `gorm:"foreignKey:UserRef;references:UserID"` // user FK
	Data      datatypes.JSON `json:"data" gorm:"type:JSONB;column:data"`   // Store additional metadata for users
}

func (user *User) CreateUser(db *gorm.DB, payload User) (User, error) {
	result := db.Create(&payload)

	if result.Error != nil {
		return payload, result.Error
	}

	return payload, nil
}
