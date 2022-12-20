package routes

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/Hyperkid123/analytics-prototyping/service"
	"github.com/Hyperkid123/analytics-prototyping/util"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

func GetLayouts(response http.ResponseWriter, request *http.Request) {
	// TODO: Setup better error handling
	userString := request.Context().Value("USER").(string)
	user := models.User{
		UserID: uuid.MustParse(userString),
	}
	payload := service.GetLayouts(user.UserID)
	logrus.Infoln("handled request on /layout for ", user.UserID)

	util.RespondWithJSON(response, http.StatusOK, payload)
}

func GetActiveLayout(response http.ResponseWriter, request *http.Request) {
	userString := request.Context().Value("USER").(string)
	user := models.User{
		UserID: uuid.MustParse(userString),
	}
	payload := service.GetActiveLayoutID(user.UserID)
	logrus.Infoln("handled request on /active for ", user.UserID)

	util.RespondWithJSON(response, http.StatusOK, payload)
}

func SetActiveLayout(response http.ResponseWriter, request *http.Request) {
	userString := request.Context().Value("USER").(string)
	user := models.User{
		UserID: uuid.MustParse(userString),
	}
	layoutId := chi.URLParam(request, "id")
	l64, err := strconv.ParseUint(layoutId, 10, 32)
	if err != nil {
		logrus.Errorln("Could not get Layout ID", err)
		util.RespondWithJSON(response, http.StatusBadRequest, nil)
	}
	payload := service.SetActiveLayout(user.UserID, uint(l64))
	logrus.Infoln("handled request on /active for ", user.UserID)

	util.RespondWithJSON(response, http.StatusOK, payload)
}

func StoreLayout(response http.ResponseWriter, request *http.Request) {
	var layout map[string]interface{}
	err := json.NewDecoder(request.Body).Decode(&layout)

	if err != nil {
		logrus.Infoln("Cannot decode layout", err)
		http.Error(response, err.Error(), http.StatusBadRequest)
		return
	}

	logrus.Infoln("handled request on /layout")
	payload, err := service.StoreLayout(layout)
	if err != nil {
		logrus.Infoln("can't create layout ", err)
		util.RespondWithJSON(response, http.StatusBadRequest, err)
	}

	util.RespondWithJSON(response, http.StatusOK, payload)
}

// TODO: Setup better error handling
func GetWidgets(response http.ResponseWriter, request *http.Request) {
	userString := request.Context().Value("USER").(string)
	user := models.User{
		UserID: uuid.MustParse(userString),
	}
	payload := service.GetWidgets(user.UserID)

	util.RespondWithJSON(response, http.StatusOK, payload)
}
