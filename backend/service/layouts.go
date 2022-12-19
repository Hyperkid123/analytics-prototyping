package service

import (
	"encoding/json"
	"fmt"

	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/thedevsaddam/gojsonq/v2"
)

func GetLayout(userId uuid.UUID) []models.Layout {
	var layout []models.Layout

	database.DB.Where("user_ref = ?", userId).Find(&layout)

	return layout
}

func GetWidgets(userId uuid.UUID) []models.Widget {
	var widgets []models.Widget

	database.DB.Where("user_ref = ?", userId).Find(&widgets)

	return widgets
}

func createLayout(layout interface{}, user models.User) (models.Layout, error) {
	var newLayout models.Layout

	delete(layout.(map[string]interface{}), "user")
	uuidString := fmt.Sprintf("%v", user.UserID)
	uuidVal, err := uuid.Parse(uuidString)
	if err != nil {
		logrus.Infoln("Cannot get user from layout", err)
		return models.Layout{}, err
	}

	b, err := json.Marshal(layout)
	if err != nil {
		logrus.Infoln("Cannot marshall layout", err)
		return models.Layout{}, err
	}

	newLayout = models.Layout{
		UserRef: uuidVal,
		Data:    b,
	}

	err = database.DB.Create(&newLayout).Error
	if err != nil {
		logrus.Infoln("Cannot create layout", err)
		return models.Layout{}, err
	}

	// err = database.DB.Model(&user).Association("Layouts").Append(&newLayout)
	// if err != nil {
	// 	return models.Layout{}, err
	// }

	return newLayout, nil
}

func StoreLayout(layout interface{}) (interface{}, error) {
	userId := gojsonq.New().FromInterface(layout).Find("user.id")
	userUUID, err := uuid.Parse(userId.(string))

	if err != nil {
		return nil, err
	}

	exists, user := CheckExistingUser(userUUID)
	if !exists {
		return nil, fmt.Errorf("layout is not associate with any user")
	}

	// create new event in DB
	payload, err := createLayout(layout, user)
	if err != nil {
		return nil, err
	}

	return payload, nil
}
