package main

import (
	"github.com/joho/godotenv"
	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/database"
)

func main() {
	godotenv.Load()
	initDependencies()
}

func initDependencies() {
	config.Init()
	database.Init()
}
