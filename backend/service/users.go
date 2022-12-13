package service

import (
	"fmt"

	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
)

func GetUsers() []models.User {
	var users []models.User

	database.DB.Find(&users)

	return users
}

func GetUser(id uint) (models.User, error) {
	var user models.User

	result := database.DB.First(&user, id)

	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

func DeleteUser(id uint) error {
	var user models.User

	result := database.DB.Delete(&user, id)
	fmt.Println(result)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func UpdateUser(payload models.User) (models.User, error) {
	result := database.DB.Save(&payload)

	if result.Error != nil {
		return payload, result.Error
	}

	return payload, nil
}
