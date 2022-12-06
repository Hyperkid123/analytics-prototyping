package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/database"
	"github.com/Hyperkid123/analytics-prototyping/models"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func initDependencies() *gorm.DB {
	config.Init()
	DB := database.Init()

	return DB
}

func main() {
	godotenv.Load()
	initDependencies()
	router := chi.NewRouter()

	router.Get("/", HealthProbe)
	router.Get("/events", GetEvents)
	router.Get("/users", GetUsers)
	router.Post("/users", PostUser)

	
	logrus.Infoln("----------------------------------")
	logrus.Infoln("Starting http server on port: 8000")
	logrus.Infoln("----------------------------------")
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

func GetUsers(response http.ResponseWriter, request *http.Request) {
	payload := "Fetch users from the database after we get models."
	logrus.Infoln("handled request on /users ")
	user := models.UserModel{}
	fmt.Println(user)

	respondWithJSON(response, http.StatusOK, payload)
}

func PostUser(w http.ResponseWriter, r *http.Request) {
	var userJson models.UserJSON
	userID := uuid.New()

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&userJson)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(userJson)

	var response = models.UserJSON{}

	logrus.Infoln(
		"Inserting user into DB: " +
			"ID = " + userID.String() + // What we generate above, this sucks
			" Avatar = " + userJson.Avatar +
			" Birthday = " + userJson.Birthday.String() +
			" Email = " + userJson.Email +
			" FirstName = " + userJson.FirstName +
			" LastName = " + userJson.LastName +
			" SubscriptionTier = " + userJson.SubscriptionTier)

	// if err != nil {
	// 	panic(fmt.Sprintf("Inserting user into database failed: %s", err.Error()))
	// }

	logrus.Infoln("User inserted successfully")

	json.NewEncoder(w).Encode(response)
}
