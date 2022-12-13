package service

import (
	"encoding/json"
	"fmt"

	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/google/uuid"
	"github.com/thedevsaddam/gojsonq/v2"
)

func GetEvents() []models.Event {
	var events []models.Event

	database.DB.Find(&events)

	return events
}

func createEvent(event interface{}, user models.User) (models.Event, error) {
	var newEvent models.Event

	delete(event.(map[string]interface{}), "user")
	uuidString := fmt.Sprintf("%v", user.UserID)
	uuidVal, err := uuid.Parse(uuidString)
	if err != nil {
		return models.Event{}, err
	}

	b, err := json.Marshal(event)
	if err != nil {
		return models.Event{}, err
	}

	newEvent = models.Event{
		UserRef: uuidVal,
		Data:    b,
	}

	err = database.DB.Create(&newEvent).Error
	if err != nil {
		return models.Event{}, err
	}

	err = database.DB.Model(&user).Association("Events").Append(&newEvent)
	if err != nil {
		return models.Event{}, err
	}

	return newEvent, nil
}

func HandleEvent(event interface{}) (interface{}, error) {
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
