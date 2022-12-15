package service

import (
	"encoding/json"
	"fmt"

	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/google/uuid"
	"github.com/thedevsaddam/gojsonq/v2"
)

func GetLayout(userId uuid.UUID) models.Layout {
	var layout models.Layout

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
		return models.Layout{}, err
	}

	b, err := json.Marshal(layout)
	if err != nil {
		return models.Layout{}, err
	}

	newLayout = models.Layout{
		UserRef: uuidVal,
		Data:    b,
	}

	err = database.DB.Create(&newLayout).Error
	if err != nil {
		return models.Layout{}, err
	}

	err = database.DB.Model(&user).Association("Events").Append(&newLayout)
	if err != nil {
		return models.Layout{}, err
	}

	return newLayout, nil
}

func StoreLayout(event interface{}) (interface{}, error) {
	eventType := gojsonq.New().FromInterface(event).Find("type")
	if fmt.Sprintf("%v", eventType) == "identify" {
		userId := gojsonq.New().FromInterface(event).Find("payload.id")
		userPayload := gojsonq.New().FromInterface(event).Find("payload")
		fmt.Println(eventType, userId)
		userUUID, err := uuid.Parse(userId.(string))
		if err != nil {
			return nil, err
		}
		IdentifyUser(userUUID, userPayload)

		sessionId, err := uuid.NewUUID()
		if err != nil {
			return nil, err
		}
		response := map[string]interface{}{}
		response["error"] = false
		response["init"] = true
		response["uuid"] = sessionId
		return response, nil
	}
	// Check for correct user associated with event
	userId := gojsonq.New().FromInterface(event).Find("user.id")
	userUUID, err := uuid.Parse(userId.(string))

	if err != nil {
		return nil, err
	}

	exists, user := CheckExistingUser(userUUID)
	if !exists {
		return nil, fmt.Errorf("event is not associate with any user")
	}

	// create new event in DB
	_, err = createEvent(event, user)
	if err != nil {
		return nil, err
	}
	// Default event response
	payload := map[string]interface{}{}
	payload["error"] = false
	payload["init"] = false

	return payload, nil
}
