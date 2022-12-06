package config

import (
	"github.com/joho/godotenv"
	"os"
	"strconv"
)

type AnalyticsServiceConfig struct {
	WebPort       int
	DbHost        string
	DbUser        string
	DbPassword    string
	DbPort        int
	DbName        string
	DbSSLMode     string
	DbSSLRootCert string
}

var config *AnalyticsServiceConfig

func Init() {
	godotenv.Load()
	options := &AnalyticsServiceConfig{}

	options.WebPort = 8000
	options.DbUser = os.Getenv("PGSQL_USER")
	options.DbPassword = os.Getenv("PGSQL_PASSWORD")
	options.DbHost = os.Getenv("PGSQL_HOSTNAME")
	port, _ := strconv.Atoi(os.Getenv("PGSQL_PORT"))
	options.DbPort = port
	options.DbName = os.Getenv("PGSQL_DATABASE")
	options.DbSSLMode = "disable"
	options.DbSSLRootCert = ""

	config = options
}

// Returning analytics service configuration
func Get() *AnalyticsServiceConfig {
	return config
}
