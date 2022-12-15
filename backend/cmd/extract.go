package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/sirupsen/logrus"
)

func main() {
	config.Init()
	database.Init()

	var users []models.User
	database.DB.Preload("Events").Find(&users)

	var userData []map[string]interface{}
	var eventsData []map[string]interface{}
	for _, user := range users {
		newUserB := map[string]interface{}{}
		newUserB["id"] = user.UserID
		b, err := json.Marshal(user.Data)
		if err != nil {
			panic(err)
		}
		err = json.Unmarshal(b, &newUserB)
		if err != nil {
			panic(err)
		}
		userData = append(userData, newUserB)
		var userEvents []map[string]interface{}
		for _, event := range user.Events {
			newEventB := map[string]interface{}{}
			b, err := json.Marshal(event.Data)
			if err != nil {
				panic(err)
			}
			err = json.Unmarshal(b, &newEventB)
			if err != nil {
				panic(err)
			}
			newEventB["user"] = newUserB
			userEvents = append(userEvents, newEventB)
		}
		eventsData = append(eventsData, userEvents...)
	}
	fmt.Println(userData[0], len(eventsData))

	jsonFile, err := os.Open("db.json")
	if err != nil {
		panic(err)
	}

	byteValue, err := ioutil.ReadAll(jsonFile)

	if err != nil {
		panic(err)
	}

	var jsonContent map[string]interface{}
	json.Unmarshal(byteValue, &jsonContent)

	jsonContent["users"] = userData
	jsonContent["events"] = eventsData

	b, err := json.MarshalIndent(&jsonContent, "", "  ")

	if err != nil {
		panic(err)
	}

	ioutil.WriteFile("db.json", b, 0644)

	logrus.Infoln("Extracted ", len(userData), " users from DB.")
	logrus.Infoln("Extracted ", len(eventsData), " events from DB.")

	defer jsonFile.Close()
}
