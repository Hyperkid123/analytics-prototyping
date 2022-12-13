package service

import (
	"github.com/Hyperkid123/analytics-prototyping/models"
	"gorm.io/gorm"
)

func GetEvents(db *gorm.DB) []models.Event {
	var events []models.Event

	db.Find(&events)

	return events
}
