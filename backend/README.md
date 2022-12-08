Analytics Service Backend
========================
Gather frontend analytics for services.

Pre-requisites
--------------
- Golang
- Docker (for local development)

Configuration
-------------
There are environment variables that are necessary for the application to start.
Please copy the contents within env.example and move them over to a new .env file
at the root of your local app directory. There, set the values of the variables
accordingly for your local db configuration.

Running the thing
-----------------
Start the DB (local development).
```
systemctl start docker
docker-compose up analytics-service-db
```

Start the backend.
`go run main.go`

Contributing
--------------------
All outstanding issues or feature requests should be filed as Issues on this GitLab
page. MRs should be submitted against the master branch for any new features or changes.

Authors and Acknowledgement
-----------------------------
Dr. Brantley (dr.brantley@redhat.com)  
Brandon Schneider (bschneid@redhat.com)
