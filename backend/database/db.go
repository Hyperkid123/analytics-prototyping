package database

import (
	"os"
	"flag"
	"fmt"
	"encoding/json"
	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
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
		if !DB.Migrator().HasTable(&models.Session{}) {
			logrus.Infoln("Creating Session table...")
			DB.Migrator().CreateTable(&models.Session{})
		}
		if !DB.Migrator().HasTable(&models.Journey{}) {
			logrus.Infoln("Creating Journey table...")
			DB.Migrator().CreateTable(&models.Journey{})
		}
		if !DB.Migrator().HasTable(&models.Event{}) {
			logrus.Infoln("Creating Event table...")
			DB.Migrator().CreateTable(&models.Event{})
		}

		logrus.Infoln("Running auto-migration...")
		DB.AutoMigrate(&models.User{},&models.Session{},&models.Journey{},&models.Event{})
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

		for i := 0; i < lenUsers; i++ {
			user := users[i].(map[string]interface{})

			userUUID, UUIDErr := uuid.Parse(user["id"].(string))
			if UUIDErr != nil {
				logrus.Fatal("User ID parse failed:", UUIDErr.Error())
			}

			delete(user, "id") // Delete the ID, Store the rest in the "data" JSON blob
			userMarshal, userMarshalErr := json.Marshal(user)
			if userMarshalErr != nil {
				logrus.Fatal("User Marshal failed:", userMarshalErr.Error())
			}
			
			newUser := models.User{UserID:userUUID, Data:userMarshal}
			newUser.ID = uuid.New()
			result := DB.Create(&newUser)

			if result.Error != nil {
				logrus.Fatal("Error creating user:", userUUID, result.Error.Error())
			} else {
				usersCreated++
			}
		}

		logrus.Infoln("Created users:", usersCreated)

		// Get Events to Seed

		// Create Sessions from Events

		// Create Journeys from Events

	}

	return DB
}
