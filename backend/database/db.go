package database

import (
	"flag"
	"fmt"
	"os"

	"encoding/json"

	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/thedevsaddam/gojsonq/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() *gorm.DB {
	var err error
	var dialector gorm.Dialector

	cfg := config.Get()
	var dbdns string

	dbdns = fmt.Sprintf("host=%v user=%v password=%v dbname=%v port=%v sslmode=%v", cfg.DbHost, cfg.DbUser, cfg.DbPassword, cfg.DbName, cfg.DbPort, cfg.DbSSLMode)
	if cfg.DbSSLRootCert != "" {
		dbdns = fmt.Sprintf("%s  sslrootcert=%s", dbdns, cfg.DbSSLRootCert)
	}

	dialector = postgres.Open(dbdns)

	DB, err = gorm.Open(dialector, &gorm.Config{})

	// Grab command line arguments
	// --migrate-db 			- Perform the DB migration
	// --seed-db=some-file.json	- Seed the DB with a JSON file
	doMigration := flag.Bool("migrate-db", false, "Do DB migration")
	var seedFile string
	flag.StringVar(&seedFile, "seed-db", "", "JSON File to seed the DB")
	flag.Parse()

	// Perform DB Migration
	if *doMigration {
		logrus.Infoln("-----------------------------")
		logrus.Infoln("Performing database migration")
		logrus.Infoln("-----------------------------")
		// Migration/Creation of data tables for DB
		// NOTE: Order of table creation matters
		// Dependent tables must be created in the right
		// order so that relations and keys exist.
		if !DB.Migrator().HasTable(&models.User{}) {
			logrus.Infoln("Creating User table...")
			DB.Migrator().CreateTable(&models.User{})
		}
		// if !DB.Migrator().HasTable(&models.Session{}) {
		// 	logrus.Infoln("Creating Session table...")
		// 	DB.Migrator().CreateTable(&models.Session{})
		// }
		// if !DB.Migrator().HasTable(&models.Journey{}) {
		// 	logrus.Infoln("Creating Journey table...")
		// 	DB.Migrator().CreateTable(&models.Journey{})
		// }
		if !DB.Migrator().HasTable(&models.Event{}) {
			logrus.Infoln("Creating Event table...")
			DB.Migrator().CreateTable(&models.Event{})
		}
		if !DB.Migrator().HasTable(&models.Widget{}) {
			logrus.Infoln("Creating Widget table...")
			DB.Migrator().CreateTable(&models.Widget{})
		}
		if !DB.Migrator().HasTable(&models.Layout{}) {
			logrus.Infoln("Creating Layout table...")
			DB.Migrator().CreateTable(&models.Layout{})
		}

		if !DB.Migrator().HasTable(&models.EventType{}) {
			logrus.Infoln("Creating EventType table...")
			DB.Migrator().CreateTable(&models.EventType{})
		}

		logrus.Infoln("Running auto-migration...")
		DB.AutoMigrate(&models.User{}, &models.Event{}, &models.EventType{}, &models.Widget{}, &models.Layout{})
	}

	if err != nil {
		logrus.Fatal("Database connection failed:", err.Error())
	}

	logrus.Infoln("Database connection succesful.")

	// Seed the DB
	if seedFile != "" {
		logrus.Infoln("--------------")
		logrus.Infoln("Seeding the DB")
		logrus.Infoln("--------------")
		logrus.Infoln("File:", seedFile)

		// Read Seed File
		rawData, readErr := os.ReadFile(seedFile)
		if readErr != nil {
			logrus.Fatal("Seed file read failed:", readErr.Error())
		}
		// Unmarshal Raw JSON file bytes
		var seedData interface{}
		unmarshalErr := json.Unmarshal(rawData, &seedData)
		if unmarshalErr != nil {
			logrus.Fatal("Seed JSON Unmarshal failed:", unmarshalErr.Error())
		}
		seedJson := seedData.(map[string]interface{})

		// Seed Users
		users := seedJson["users"].([]interface{})
		lenUsers := len(users)
		logrus.Infoln("Number of users found:", lenUsers)

		usersCreated := 0
		usersUpdated := 0
		userIDs := make(map[string]uint) // Keep track of UserIDs for later reference
		widgetsCreated := 0
		eventsCreated := 0
		eventTypesCreated := 0

		for i := 0; i < lenUsers; i++ {
			user := users[i].(map[string]interface{})
			userB := users[i].(interface{})

			// Bail if there isnt a user ID
			if user["id"] == nil {
				continue
			}
			// Bail if we've already created this user
			if val, ok := userIDs[user["id"].(string)]; ok {
				logrus.Debugln(val, "user already exists. Skipping.")
				continue
			}

			userIdString := user["id"].(string)

			delete(user, "id") // Delete the ID, Store the rest in the "data" JSON blob
			b, err := json.Marshal(userB)
			if err != nil {
				logrus.Fatal("Error marshaling user:", err)
			}
			var existingUser models.User
			result := DB.Where("user_id = ?", userIdString).First(&existingUser)
			if result.RowsAffected > 0 {
				existingUser.Data = b
				DB.Save(&user)
				usersUpdated += 1
			} else {
				newUser := models.User{UserID: userIdString, Data: b}
				result = DB.Create(&newUser)

				if result.Error != nil {
					logrus.Fatal("Error creating user:", userIdString, result.Error.Error())
				} else {
					usersCreated++
					userIDs[userIdString] = newUser.ID // Track ref user ID
				}
			}
		}

		logrus.Infoln("Created users:", usersCreated)
		logrus.Infoln("Updated users:", usersUpdated)

		// Get all Events
		// Used for seeding other things
		events := seedJson["events"].([]interface{})
		lenEvents := len(events)

		// Create Sessions from Events
		logrus.Infoln("Events found for Sessions:", lenEvents)

		// Clear all events before seeding
		DB.Unscoped().Where("1 = 1").Delete(&models.Event{})
		DB.Unscoped().Where("1 = 1").Delete(&models.EventType{})

		eventTypes := map[string]models.EventType{}

		for i := 0; i < lenEvents; i++ {
			event := events[i].(map[string]interface{})

			eventTypeString := gojsonq.New().FromInterface(event).Find("type").(string)
			eventType, typeExists := eventTypes[eventTypeString]
			if !typeExists {
				eventType = models.EventType{
					EventName: eventTypeString,
				}
				DB.Create(&eventType)
				eventTypes[eventTypeString] = eventType
				eventTypesCreated += 1
			}
			// get user ref
			userRef := gojsonq.New().FromInterface(event).Find("user.id")
			// Bail if we don't find a user ID
			if userRef == nil {
				continue
			}

			// remove user propery from event
			delete(event, "user")
			uuidString := fmt.Sprintf("%v", userRef)
			uuidVal, err := uuid.Parse(uuidString)
			if err != nil {
				logrus.Fatal("User Ref uuid parse failed:", err.Error())
			}

			var eventUser models.User
			result := DB.Where("user_id   = ?", uuidString).First(&eventUser)

			if result.Error != nil || result.RowsAffected == 0 {
				// no user associated with the event
				logrus.Infoln("Unable to find event user: ", result.Error.Error(), "skipping")
				continue
			}

			b, err := json.Marshal(event)

			if err != nil {
				logrus.Fatal("Unable to parse event data: ", err.Error())
			}

			newEvent := models.Event{
				UserRef:     uuidVal,
				Data:        b,
				EventTypeID: eventType.ID,
			}

			result = DB.Create(&newEvent)

			if result.Error != nil {
				logrus.Fatal("Error creating event:", newEvent, result.Error.Error())
			}

			DB.Model(&eventUser).Association("Events").Append(&newEvent)
			DB.Model(&eventType).Association("Events").Append(&newEvent)
			eventsCreated += 1

		}

		layout := seedJson["layout"].(map[string]interface{})
		userRef := gojsonq.New().FromInterface(layout).Find("user.id")
		logrus.Info(userRef)
		// Bail if we don't find a user ID
		if userRef == nil {
			return DB
		}
		logrus.Infoln("Created events:", eventsCreated)
		logrus.Infoln("Created event types:", eventTypesCreated)

		// remove user propery from event
		delete(layout, "user")
		uuidString := fmt.Sprintf("%v", userRef)
		uuidVal, err := uuid.Parse(uuidString)
		if err != nil {
			logrus.Fatal("User Ref uuid parse failed:", err.Error())
		}

		var layoutUser models.User
		result := DB.Where("user_id   = ?", uuidString).First(&layoutUser)
		logrus.Info(layoutUser)

		if result.Error != nil {
			// no user associated with the event
			logrus.Infoln("Unable to find layout user: ", result.Error.Error(), "skipping")
			return DB
		}

		b, err := json.Marshal(layout)

		if err != nil {
			logrus.Fatal("Unable to parse layout data: ", err.Error())
		}

		newLayout := models.Layout{
			UserRef: uuidVal,
			Data:    b,
		}

		result = DB.Create(&newLayout)

		if result.Error != nil {
			logrus.Fatal("Error creating layout:", newLayout, result.Error.Error())
		}

		widgets := seedJson["widgets"].(map[string]interface{})

		userRef = gojsonq.New().FromInterface(widgets).Find("user.id")
		// Bail if we don't find a user ID
		if userRef == nil {
			return DB
		}

		// remove user propery from event
		delete(widgets, "user")
		uuidString = fmt.Sprintf("%v", userRef)
		uuidVal, err = uuid.Parse(uuidString)
		if err != nil {
			logrus.Fatal("User Ref uuid parse failed:", err.Error())
		}

		var widgetUser models.User
		result = DB.Where("user_id   = ?", uuidString).First(&widgetUser)

		if result.Error != nil || result.RowsAffected == 0 {
			// no user associated with the event
			logrus.Infoln("Unable to find widget user: ", result.Error.Error(), "skipping")
		}

		b, err = json.Marshal(widgets)

		if err != nil {
			logrus.Fatal("Unable to parse widget data: ", err.Error())
		}

		newWidget := models.Widget{
			UserRef: uuidVal,
			Data:    b,
		}

		result = DB.Create(&newWidget)

		if result.Error != nil {
			logrus.Fatal("Error creating event:", newWidget, result.Error.Error())
		}
		widgetsCreated += 1
		logrus.Infoln("Created widgets:", widgetsCreated)
	}

	return DB
}
