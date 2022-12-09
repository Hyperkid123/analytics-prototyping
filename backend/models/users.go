package models

import (
	"fmt"

	"github.com/jackc/pgtype"
	"gorm.io/gorm"
)

// Users
type User struct {
	BaseModel              // Store the internal ID for that user
	Data      pgtype.JSONB `json:"data" gorm:"type:jsonb;column:data"` // Store additional metadata for users
}

func (user *User) CreateUser(db *gorm.DB, payload User) (User, error) {
	result := db.Create(&payload)

	if result.Error != nil {
		return payload, result.Error
	}

	return payload, nil
}

func GetUsers(db *gorm.DB) []User {
	var users []User

	db.Find(&users)

	return users
}

func GetUser(db *gorm.DB, id uint) (User, error) {
	var user User

	result := db.First(&user, id)

	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

func DeleteUser(db *gorm.DB, id uint) error {
	var user User

	result := db.Delete(&user, id)
	fmt.Println(result)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func UpdateUser(db *gorm.DB, payload User) (User, error) {
	result := db.Save(&payload)

	if result.Error != nil {
		return payload, result.Error
	}

	return payload, nil
}
