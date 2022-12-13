package routes

import (
	"encoding/json"
	"net/http"

	"github.com/Hyperkid123/analytics-prototyping/service"
	"github.com/Hyperkid123/analytics-prototyping/util"
	"github.com/sirupsen/logrus"
)

func GetEvents(response http.ResponseWriter, request *http.Request) {
	payload := service.GetEvents()
	logrus.Infoln("handled request on /events ")

	util.RespondWithJSON(response, http.StatusOK, payload)
}

func PostEvent(response http.ResponseWriter, request *http.Request) {
	var event map[string]interface{}
	err := json.NewDecoder(request.Body).Decode(&event)

	if err != nil {
		http.Error(response, err.Error(), http.StatusBadRequest)
		return
	}

	payload, err := service.HandleEvent(event)
	if err != nil {
		util.RespondWithJSON(response, http.StatusBadRequest, err)
	}

	util.RespondWithJSON(response, http.StatusOK, payload)
}
