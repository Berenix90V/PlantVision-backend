# Smart Plants

Smart plants is a group project developed for the Embedded linux course at [Tuku University of Applied Sciences](tuas.fi).

## Project structure

The project is divided in 3 pieces: Backend, frontend and embedded.

### Backend

The backend code manages a REST API that interacts with a [time series database](https://en.wikipedia.org/wiki/Time_series_database) to store and retrieve sensor data efficiently.

#### Stack

The backend code is written in [TypeScript](https://www.typescriptlang.org/), so to give the application a robut type check, especially important when it comes to unstructured data.

The database used is [MongoDb](https://www.mongodb.com/), since from version `5.0` allows time series data documents.

Notable libraries used include:

- [Express](https://expressjs.com) provides a minimal framework to build the API
- [mongoose](https://mongoosejs.com/) provides a driver for the mongodb database, allowing to map objects to documents for more security and consistency
- [Jest](https://jestjs.io/) provides a framework for unit and coverage testing
- [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) provides capabilities to build and manage in-memory mongodb instances for mock testing

#### Routes

The backend REST API exposes two routes: `/plants` and `/sensors`.

## Installation

Make sure you have `docker` and `docker-compose` installed. If not:

- On windows install [Docker Desktop](https://docs.docker.com/desktop/windows/install/)
- On Linux: `sudo apt update;  sudo apt install docker docker-compose`

> From now on linux commands are used, but are identical to a Windows installation of docker, you just need docker desktop running

Check that you have correctly installed `docker` and `docker-compose`:

```sh
docker -v
docker-compose -v
```

should output their respective versions.

Then execute `docker-compose up -d` in the `backend` directory:

```sh
cd backend/
docker-compose up -d
```

After it has downloaded check that the containers `database` and `node-dev` are up and running:

```sh
docker-compose ps
```

should give an output similar to this:
```sh
         Name                        Command               State           Ports
-----------------------------------------------------------------------------------------
smart-plants_database_1   docker-entrypoint.sh mongod      Up      27017/tcp
smart-plants_node-web_1   docker-entrypoint.sh npm start   Up      0.0.0.0:5000->5000/tcp
```

If the outputs match, visit [http://localhost:5000/plants](http://localhost:5000/plants) and check that there is an empty JSON array as output.

**You are set!**

## TODO

- [ ] Backend
  - [X] Routes
  - [X] Database
  - [ ] Documentation
  - [X] Deployment using Docker
  - [ ] CI/CD
  - [X] Unit and Coverage testing for routes
- [ ] Frontend
- [ ] Embedded
