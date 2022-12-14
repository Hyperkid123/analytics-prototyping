package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/Hyperkid123/analytics-prototyping/service"
	"github.com/Hyperkid123/analytics-prototyping/util"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

func GetUsers(response http.ResponseWriter, request *http.Request) {
	payload := service.GetUsers()

	logrus.Infoln(payload)

	util.RespondWithJSON(response, http.StatusOK, payload)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
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

func PostUser(w http.ResponseWriter, r *http.Request) {
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

	// FIXME: The user ID has to come in the request payload
	user.UserID = userUUID.String()
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

func DeleteUser(w http.ResponseWriter, r *http.Request) {
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

func UpdateUser(w http.ResponseWriter, r *http.Request) {
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
