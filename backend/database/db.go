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

	// Seed the DB
	if seedFile != "" {
		fmt.Println("--------------")
		fmt.Println("Seeding the DB")
		fmt.Println("--------------")
		fmt.Println("File:", seedFile)

		// Read Seed File
		rawData, readErr := os.ReadFile(seedFile)
		if readErr != nil {
			panic(fmt.Sprintf("Seed file read failed: %s", readErr.Error()))
		}
		// Unmarshal Raw JSON file bytes
		var seedData interface{}
		unmarshalErr := json.Unmarshal(rawData, &seedData)
		if unmarshalErr != nil { 
		    panic(fmt.Sprintf("Seed JSON Unmarshal failed: %s", unmarshalErr.Error()))
		}
		seedJson := seedData.(map[string]interface{})

		// Seed Users
		users := seedJson["users"].([]interface{})
		lenUsers := len(users)
		fmt.Println("Number of users found:", lenUsers)

		usersCreated := 0

		for i := 0; i < lenUsers; i++ {
			user := users[i].(map[string]interface{})

			userUuid, uuidErr := uuid.Parse(user["id"].(string))
			if uuidErr != nil {
				panic(fmt.Sprintf("User ID parse failed: %s", uuidErr.Error()))
			}

			delete(user, "id") // Delete the ID, Store the rest in the "data" JSON blob
			userMarshal, userMarshalErr := json.Marshal(user)
			if userMarshalErr != nil {
				panic(fmt.Sprintf("User Marshal failed: %s", userMarshalErr.Error()))
			}
			
			newUser := models.User{UserID:userUuid, Data:userMarshal}
			newUuid := uuid.New()
			newUser.ID = newUuid
			result := DB.Create(&newUser)

			if result.Error != nil {
				fmt.Sprintf("Error creating user %s:%s", userUuid, result.Error.Error())
			} else {
				usersCreated++
			}
		}

		fmt.Println("Created users:", usersCreated)

		// Get Events to Seed

		// Create Sessions from Events

		// Create Journeys from Events

	}

	// Perform DB Migration
	if *doMigration {
		fmt.Println("-----------------------------")
		fmt.Println("Performing database migration")
		fmt.Println("-----------------------------")
		// Migration/Creation of data tables for DB
		// NOTE: Order of table creation matters
		// Dependent tables must be created in the right
		// order so that relations and keys exist.
		if !DB.Migrator().HasTable(&models.User{}) {
			fmt.Println("Creating User table...")
			DB.Migrator().CreateTable(&models.User{})
		}
		if !DB.Migrator().HasTable(&models.Session{}) {
			fmt.Println("Creating Session table...")
			DB.Migrator().CreateTable(&models.Session{})
		}
		if !DB.Migrator().HasTable(&models.Journey{}) {
			fmt.Println("Creating Journey table...")
			DB.Migrator().CreateTable(&models.Journey{})
		}
		if !DB.Migrator().HasTable(&models.Event{}) {
			fmt.Println("Creating Event table...")
			DB.Migrator().CreateTable(&models.Event{})
		}

		fmt.Println("Running auto-migration...")
		DB.AutoMigrate(&models.User{},&models.Session{},&models.Journey{},&models.Event{})
	}
	
	if err != nil {
		panic(fmt.Sprintf("Database connection failed: %s", err.Error()))
	}

	fmt.Println("Database connection succesful.")

	return DB
}
