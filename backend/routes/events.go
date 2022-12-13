package routes

import (
	"net/http"

	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/service"
	"github.com/Hyperkid123/analytics-prototyping/util"
	"github.com/sirupsen/logrus"
)

func GetEvents(response http.ResponseWriter, request *http.Request) {
	payload := service.GetEvents(database.DB)
	logrus.Infoln("handled request on /events ")

	util.RespondWithJSON(response, http.StatusOK, payload)
}
