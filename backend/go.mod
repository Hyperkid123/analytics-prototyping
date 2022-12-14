module github.com/Hyperkid123/analytics-prototyping

go 1.18

require (
	github.com/go-chi/chi/v5 v5.0.7
	github.com/google/uuid v1.3.0
	github.com/joho/godotenv v1.4.0
	github.com/sirupsen/logrus v1.9.0
	gorm.io/gorm v1.24.2
)

require (
	github.com/go-chi/cors v1.2.1 // indirect
	github.com/go-sql-driver/mysql v1.7.0 // indirect
	github.com/jackc/chunkreader/v2 v2.0.1 // indirect
	github.com/jackc/pgconn v1.13.0 // indirect
	github.com/jackc/pgio v1.0.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgproto3/v2 v2.3.1 // indirect
	github.com/jackc/pgservicefile v0.0.0-20200714003250-2b9c44734f2b // indirect
	github.com/jackc/pgtype v1.13.0 // indirect
	github.com/jackc/pgx/v4 v4.17.2 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/thedevsaddam/gojsonq/v2 v2.5.2 // indirect
	golang.org/x/crypto v0.3.0 // indirect
	golang.org/x/sys v0.2.0 // indirect
	golang.org/x/text v0.5.0 // indirect
	gorm.io/datatypes v1.1.0 // indirect
	gorm.io/driver/mysql v1.4.4 // indirect
	gorm.io/driver/postgres v1.4.5 // indirect
)

replace (
	github.com/Hyperkid123/analytics-prototyping/config => ./config
	github.com/Hyperkid123/analytics-prototyping/database => ./database
	github.com/Hyperkid123/analytics-prototyping/models => ./models
)
