package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/Hyperkid123/analytics-prototyping/service"
	"github.com/Hyperkid123/analytics-prototyping/util"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

func initDependencies() {
	config.Init()
	database.Init()
}

func main() {
	godotenv.Load()
	initDependencies()
	router := chi.NewRouter()

	router.Route("/", func(subrouter chi.Router) {
		subrouter.Get("/", healthProbe)
		subrouter.Get("/events", getEvents)

	})

	router.Get("/users", getUsers)
	router.Get("/user", getUser)
	router.Post("/user", postUser)
	router.Delete("/user", deleteUser)
	router.Put("/user", updateUser)

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

	util.RespondWithJSON(response, http.StatusOK, payload)
}

func getUsers(response http.ResponseWriter, request *http.Request) {
	payload := service.GetUsers()

	logrus.Infoln(payload)

	util.RespondWithJSON(response, http.StatusOK, payload)
}

func getUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	payload, payloadError := service.GetUser(user.ID)

	if payloadError != nil {
		http.Error(w, payloadError.Error(), http.StatusBadRequest)
		return
	}

	util.RespondWithJSON(w, http.StatusOK, payload)
}

func postUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	var pMsg strings.Builder
	userUUID := uuid.New()

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user.UserID = userUUID
	payload := user.Data

	pMsg.WriteString("Inserting user into DB:")

	pMsg.WriteString(fmt.Sprintf(" uuid=%v ", user.UserID))
	for key, value := range payload {
		pMsg.WriteString(fmt.Sprintf(" %s=%s ", key, value))
	}
	logrus.Infoln(pMsg.String())

	user.CreateUser(database.DB, user)

	util.RespondWithJSON(w, http.StatusOK, user)
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = service.DeleteUser(user.ID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	util.RespondWithJSON(w, http.StatusOK, err)
}

func updateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	var pMsg strings.Builder

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	msgPayload := user.Data

	pMsg.WriteString("Updating user with values:")

	pMsg.WriteString(fmt.Sprintf(" id=%v ", user.ID))
	for key, value := range msgPayload {
		pMsg.WriteString(fmt.Sprintf(" %s=%s ", key, value))
	}
	logrus.Infoln(pMsg.String())

	payload, payloadError := service.UpdateUser(user)

	if payloadError != nil {
		http.Error(w, payloadError.Error(), http.StatusBadRequest)
		return
	}

	util.RespondWithJSON(w, http.StatusOK, payload)
}
