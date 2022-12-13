package service

import (
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
	// TODO: Proper response

	payload := map[string]interface{}{}
	payload["error"] = false
	payload["init"] = true
	payload["uuid"] = "foo-bar"
	return payload, nil
}
