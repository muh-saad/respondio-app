# RespondIO App

A simple ExpressJS application which supports user authentication using jwt 
and provides functionality for adding notes against an authenticated user using factory pattern
and logging using Singleton pattern.

### Technologies

* ExpressJS
* Sequelize (MySQL)
* Redis
* Express-Validator
* Docker Compose

### Pre-requisites

* Docker should be installed

### Executing program

* Use the following command to run the program using docker-compose
```
docker-compose up --build
```
This will take care of getting the DB's ready, executing migration and running the application.

### Routes
| METHOD | Path                                           | Authentication |
|--------|------------------------------------------------|----------------|
| POST   | http://localhost:3000/users/register           | None           |
| POST   | http://localhost:3000/users/login              | None           |
| POST   | http://localhost:3000/notes                    | Bearer Token   |
| GET    | http://localhost:3000/notes                    | Bearer Token   |
| GET    | http://localhost:3000/notes/:id                | Bearer Token   |
| GET    | http://localhost:3000/notes/category/:cateogry | Bearer Token   |
| PUT    | http://localhost:3000/notes/:id                | Bearer Token   |
| DELETE | http://localhost:3000/notes/:id                | Bearer Token   |

## Author
Muhammad Saad
