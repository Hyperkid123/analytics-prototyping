package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var DB *gorm.DB

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func initDependencies() *gorm.DB {
	config.Init()
	DB = database.Init()

	return DB
}

func main() {
	godotenv.Load()
	initDependencies()
	router := chi.NewRouter()

	router.Get("/", healthProbe)
	router.Get("/events", getEvents)
	router.Get("/users", getUsers)
	router.Post("/users", postUser)

	
	logrus.Infoln("----------------------------------")
	logrus.Infoln("Starting http server on port: 8000")
	logrus.Infoln("----------------------------------")
	if err := http.ListenAndServe(":8000", router); err != nil && err != http.ErrServerClosed {
		logrus.Fatal("Api server has stopped", err.Error())
	}
}

func healthProbe(response http.ResponseWriter, request *http.Request) {
	payload := "Lookin' good"
	logrus.Infoln("handled request on / ")

	respondWithJSON(response, http.StatusOK, payload)
}

func getEvents(response http.ResponseWriter, request *http.Request) {
	payload := "Fetch stuff from the database after we get models."
	logrus.Infoln("handled request on /events ")

	respondWithJSON(response, http.StatusOK, payload)
}

func getUsers(response http.ResponseWriter, request *http.Request) {
	payload := "Fetch users from the database after we get models."
	logrus.Infoln("handled request on /users ")

	respondWithJSON(response, http.StatusOK, payload)
}

func postUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	var pMsg strings.Builder

	userRepo := models.UserRepoInterface(DB)
	user.UserID = uuid.New()

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	payload := user.Data.Get().(map[string]interface{})
	pMsg.WriteString("Inserting user into DB:")

	for key, value := range payload {
		pMsg.WriteString(fmt.Sprintf(" %s=%s ", key, value))
	}
	logrus.Infoln(pMsg.String())

	err = userRepo.CreateUser(user)

	if err != nil {
		logrus.Fatal(err)
	}

	respondWithJSON(w, http.StatusOK, user)
}
