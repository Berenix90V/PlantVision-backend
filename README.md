# PlantVisor

This project aims at creating a platform in which users can install a small packet of sensors, specifically temperature, humidity, soil moisture and light intensity, close to their plants, and monitor their state by reading the values of the sensor from the application, as well as taking pictures of the plants, score them based on their health, and giving them small key words or phrases.

## Authors

- Cristian Nicolae Lupascu (<cristiannicolae.lupascu@edu.turkuamk.fi>, <880140@stud.unive.it>)
- Veronica Zanella (<vernoica.zanella@edu.turkuamk.fi>, <826582@stud.unive.it>)

## Deployment

The backend and the database are deployed inside docker containers, built using `docker-compose`:

- For the backend we used `gmolaire/yarn` since it had all the necessary tools to build and run a typescript-node-express application using `yarn`
- For the database we used the official `arm64v8/mongo:4.4` image, with the specific version `4.4`, since according to multiple forums and our own testing, is the last stable version fully working on raspberry Pis.

To setup the raspberry pi it is needed to do some preliminary steps:

1. Install docker and docker-compose usign `sudo apt install docker docker-compose`
2. Install `ufw` to allow port `5000`, which is the port used by the backend
3. Change the rules of `ufw` to allow port `5000` only over a specific network interface
```sh
sudo ufw allow ssh # <- to allow ssh connections remotely, optional
sudo ufw enable # <- enable ufw, might lose ssh connectivity
sudo ufw allow in on eth0 to any port 5000 # <- allows connection to port 5000 only through eth0
sudo ufw reload
```
4. Give the current user (or create a new one) access to the group `docker` with `sudo usermod -aG docker $USER`
5. Build the docker containers with `docker-compose up -d`

## CI/CD

The project supports CI/CD through local runners installed on our machines, and is used to run automated tests and merge requests. It's composed of 2 steps: `build` and `test`. 

The `build` stage is used to create the execution environment, download the node packages and cache the results for faster execution.
The `test` stage will get the cached environment and will execute the unit and integrations tests that we have written for both the front and backend of the application, using a shared mongodb container built in the `build` stage.

## Backend

For the backend we decided to go with Node.JS and Express with Typescript. Using Typescript allowed us to have type and null safety, preventing us from throwing exceptions and encapsulating our code in try-catch blocks. 

### Routes

Using Express, defining routes is very easy. An example of `GET` route looks like this:
```typescript
import express, {Request, Response} from 'express'
import {User} from '../models/user/'

const router = express.Router()

/**
 * Fetches the user by its unique username
 * @param req The request
 * @param res The response
 * @returns HTTP 200 response with the user's data in JSON if the user is found,
 * HTTP 404 with a not found message otherwise
 */
const fetchByName = async (req: Request, res: Response) => {
  const username = req.params.username
  
  const user = await User.findOne({username: username})

  if(!user)
    return res.status(404).json(not_found(`User ${username} not found`))
  else
    return res.status(200).json({
      username: user.username,
      plants: user.plants
    })
}

router.get("/user/:username", fetchUserByName)

export {router as userRouter}
```

This route will then be passed to the application as a `middleware`:

```typescript
import {userRouter} from './routes/user'
...
const app = express()
...
app.use(userRouter)
```

For the full documentation refer to [the routes folder](https://git.dc.turkuamk.fi/edu.veronica.zanella/smart-plants/-/tree/master/backend/src/routes) and to the ReDoc [API documentation](https://git.dc.turkuamk.fi/edu.veronica.zanella/smart-plants/-/blob/master/backend/public/index.html). (**here Gitlab Pages would have beed the best option, but it is yet to be implemented on this instance of Gitlab.**)


### Testing

To test our backend we used [Jest](https://jestjs.io/), a renowned testing library that's easy and intuitive to use and requires almost no configuration. Here's an example of a test:

```typescript
const user: IUser = {
    username: "Silvio",
    password: "test",
    plants: []
}

describe('User', () => {
    it("should be created if doesn't exist", async () => {
        const response = await request(app).post("/user").send(user)
        expect(response.statusCode).toBe(201)
        const message: IMessage = response.body
        expect(message.type).toBe(MessageType.OK)
    })
})
```

For more tests check [the tests folder](https://git.dc.turkuamk.fi/edu.veronica.zanella/smart-plants/-/tree/master/backend/tests).

### Database

For the database we chose to use MongoDB, because it has less contraints and cheks, allowing for more speed and better data acquisition, essential in our use case. The schema of the database can be conveniently described using a pseudo JSON notation:

```typescript
[
  User: {
    name: string,
    password: hashed string,
    hubs: Optional [
      location: string,
      name: string,
      slots: number,
      plants: Optional [
        Plant: {
          name: string
          description: <Optional> string,
          plantType: string,
          sensors: [
            Sensor: {
              airTemperature: number,
              airHumdity: number,
              lightIntensity: number,
              soilMoisture: number
            }
          ],
        }
      ],
    ],
  }
]
```

To achieve this schema we used sub documents, and, since one plant belongs only to one user, and their sensor readings and attributes belong to that one plant, it makes it the best choice.

We chose to collect the bare minimum amount of data from the user, since there is no concrete need for more than a username and a password. We might add an email in the future to allow for password recovery and reset. 

In Typescript, these objects are defined using interfaces, specifically:

```typescript
// Defines a plant
interface IPlant {
    name: string,
    description?: string,
    createdAt?: Date,
    sensor?: [ISensor],
}

// Defines a sensor data packet, as to reduce the number of HTTP requests to the backend from the sensors
interface ISensor {
    airHumidity: number,
    soilMoisture: number,
    airTemperature: number,
    lightIntensity: number,
}

// Defines a Hub. A Hub is a logical space that connect multiple plants with one single sensor pack, where each plant shares all readings but the soil moisture
interface IHub {
  slots: number,
  location: string,
  name: string
  plants?: [IPlant] 
}

// Defines a simple user.
interface IUser {
    username: string,
    password: string,
    createdAt?: Date,
    hubs?: [IHub]
}
```














