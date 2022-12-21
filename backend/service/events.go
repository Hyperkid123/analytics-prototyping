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

func createEvent(event interface{}, user models.User, eventType models.EventType) (models.Event, error) {
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
		UserRef:     uuidVal,
		EventTypeID: eventType.ID,
		Data:        b,
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
	userId := gojsonq.New().FromInterface(event).Find("user.id")

	// Default event response
	payload := map[string]interface{}{}
	payload["error"] = false
	payload["init"] = false

	// event type
	eventTypeString := gojsonq.New().FromInterface(event).Find("type").(string)
	eventType := models.EventType{
		EventName: eventTypeString,
	}
	database.DB.Where("event_name = ?", eventTypeString).FirstOrCreate(&eventType)

	if eventTypeString == "identify" {
		userId = gojsonq.New().FromInterface(event).Find("payload.id")
		userPayload := gojsonq.New().FromInterface(event).Find("payload")

		if userId == nil {
			return nil, fmt.Errorf("no valid userid")
		}
		IdentifyUser(userId.(string), userPayload)

		sessionId, err := uuid.NewUUID()
		if err != nil {
			return nil, err
		}
		payload["error"] = false
		payload["init"] = true
		payload["uuid"] = sessionId
	}
	userUUID, err := uuid.Parse(userId.(string))

	if err != nil {
		return nil, err
	}

	exists, user := CheckExistingUser(userUUID)
	if !exists {
		return nil, fmt.Errorf("event is not associate with any user")
	}

	// create new event in DB
	eventEntity, err := createEvent(event, user, eventType)
	if err != nil {
		return nil, err
	}

	database.DB.Model(&eventType).Association("Events").Append(&eventEntity)

	return payload, nil
}
