package service

import (
	"encoding/json"
	"fmt"

	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
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

func IdentifyUser(userID string, payload interface{}) (models.User, error) {
	// remove extra id in payload
	delete(payload.(map[string]interface{}), "id")
	b, err := json.Marshal(payload)
	if err != nil {
		logrus.Fatal("Error marshaling user:", err)
		return models.User{}, err
	}
	var existingUser models.User
	result := database.DB.Where("user_id = ?", userID).First(&existingUser)
	if result.RowsAffected > 0 {
		existingUser.Data = b
		database.DB.Save(&existingUser)
		return existingUser, nil
	}
	user := models.User{
		UserID: userID,
		Data:   b,
	}

	err = database.DB.Create(&user).Error
	return user, err
}

func CheckExistingUser(userID uuid.UUID) (bool, models.User) {
	var user models.User
	result := database.DB.Where("user_id = ?", userID).First(&user)
	return result.RowsAffected > 0, user
}
