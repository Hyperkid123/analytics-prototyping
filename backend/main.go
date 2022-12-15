package main

import (
	"net/http"

	"github.com/Hyperkid123/analytics-prototyping/config"
	"github.com/Hyperkid123/analytics-prototyping/database"
	middleware "github.com/Hyperkid123/analytics-prototyping/middleware"
	"github.com/Hyperkid123/analytics-prototyping/routes"
	"github.com/Hyperkid123/analytics-prototyping/util"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
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

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
	}))

	router.Route("/", func(subrouter chi.Router) {
		router.Use(middleware.GetUser)
		subrouter.Get("/", healthProbe)
		subrouter.Post("/event", routes.PostEvent)
		subrouter.Get("/events", routes.GetEvents)
		subrouter.Get("/users", routes.GetUsers)
		subrouter.Get("/user", routes.GetUser)
		subrouter.Post("/user", routes.PostUser)
		subrouter.Delete("/user", routes.DeleteUser)
		subrouter.Put("/user", routes.UpdateUser)
		subrouter.Get("/layouts", routes.GetLayout)
		// TODO: implement post /layout
		subrouter.Post("/layouts", routes.StoreLayout)
		subrouter.Get("/widgets", routes.GetWidgets)
	})

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
