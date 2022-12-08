package models

import (
	"github.com/jackc/pgtype"
	"gorm.io/gorm"
)

// Users
type User struct {
	BaseModel              // Store the internal UUID for that user
	Data      pgtype.JSONB `json:"data" gorm:"type:jsonb;column:data"` // Store additional metadata for users
}

func (user *User) CreateUser(db *gorm.DB, payload User) {
	db.Create(&payload)
}

func GetUsers(db *gorm.DB) []User {
	var users []User

	db.Find(&users)

	return users
}
