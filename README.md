---
attachments: [db.png]
title: Smart Plants
created: '2022-04-03T15:52:09.534Z'
modified: '2022-04-13T09:41:20.752Z'
---

# Smart Plants

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

For the full documentation refer to [the routes folder](https://git.dc.turkuamk.fi/edu.veronica.zanella/smart-plants/-/tree/master/backend/src/routes) and to the ReDoc [API documentation](https://git.dc.turkuamk.fi/edu.veronica.zanella/smart-plants/-/blob/master/backend/public/index.html). (**here Gitlab Pages would have beed the best option, but it is yet to be implemented.**)


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
    plants: <Optional>[
      Plant: {
        name: string
        description: <Optional> string,
        sensors: [
          Sensor: {
            airTemperature: float,
            airHumdity: float,
            lightIntensity: float,
            soilMoisture: float
          }
        ],
        attributes: [
          Attribute: {
            score: integer,
            attributes: <Optional> [string],
            imageOfTheDay: <Optional> image
          }
        ]
      }
    ],
  }
]
```

To achieve this schema we used sub documents, and, since one plant belongs only to one user, and their sensor readings and attributes belong to that one plant, it makes it the best choice.

We chose to collect the bare minimum amount of data from the user, since there is no concrete need for more than a username and a password. We might add an email in the future to allow for password recovery and reset. 

In Typescript, these objects are defined using interfaces, specifically:

```typescript
interface IAttribute {
    attributes: String[],
    score?: number
    imageOfTheDay?: {
        data: Buffer,
        contentType: String
    },
    createdAt?: Date
}

interface IPlant {
    name: string,
    description?: string,
    createdAt?: Date,
    sensor?: [ISensor],
    attributes?: [IAttribute]
}

interface ISensor {
    airHumidity: number,
    soilMoisture: number,
    airTemperature: number,
    lightIntensity: number,
}

interface IUser {
    username: string,
    password: string,
    createdAt?: Date,
    plants?: IPlant[]
}
```














