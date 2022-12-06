package main

import (
	"encoding/json"
	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"net/http"
)

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func initDependencies() {
	config.Init()
	database.Init()
}

func main() {
	godotenv.Load()
	initDependencies()
	router := chi.NewRouter()

	router.Get("/", HealthProbe)
	router.Get("/events", GetEvents)

	logrus.Infoln("Starting http server on port: 8000")
	if err := http.ListenAndServe(":8000", router); err != nil && err != http.ErrServerClosed {
		logrus.Fatal("Api server has stopped", err.Error())
	}
}

func HealthProbe(response http.ResponseWriter, request *http.Request) {
	payload := "Lookin' good"
	logrus.Infoln("handled request on / ")
	respondWithJSON(response, http.StatusOK, payload)
}

func GetEvents(response http.ResponseWriter, request *http.Request) {
	payload := "Fetch stuff from the database after we get models."
	logrus.Infoln("handled request on /events ")
	respondWithJSON(response, http.StatusOK, payload)
}
