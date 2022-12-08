package database

import (
	"fmt"
	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/models"
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

	// Migration/Creation of data tables for DB
	// NOTE: Order of table creation matters
	// Dependent tables must be created in the right
	// order so that relations and keys exist.
	if !DB.Migrator().HasTable(&models.User{}) {
		DB.Migrator().CreateTable(&models.User{})
	}
	if !DB.Migrator().HasTable(&models.Session{}) {
		DB.Migrator().CreateTable(&models.Session{})
	}
	if !DB.Migrator().HasTable(&models.Journey{}) {
		DB.Migrator().CreateTable(&models.Journey{})
	}
	if !DB.Migrator().HasTable(&models.Event{}) {
		DB.Migrator().CreateTable(&models.Event{})
	}

	DB.AutoMigrate(&models.User{},&models.Session{},&models.Journey{},&models.Event{})
	
	if err != nil {
		panic(fmt.Sprintf("Database connection failed: %s", err.Error()))
	}

	fmt.Println("Database connection succesful")

	return DB
}
