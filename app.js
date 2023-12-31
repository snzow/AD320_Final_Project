// import from backend
import {createAccountAsync, createBandAvailabilityAsync, getAvailabilitiesByBandAsync, getBandsAsync, getReservationsByBandAsync, getUserInfoByUsernameAsync, loginAsync} from "./Server/backendManager.js"
import express from 'express';
import cors from 'cors';
import { login } from "./Server/dbManager.js";
import { checkPrime } from "crypto";
import multer from "multer";

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true}));
app.use(multer().none());
app.use(express.json());
app.use(cors());

/**
 * Default endpoint to show server is working
 */
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/**
 * Returns a list of all bands in the database
 */
app.get('/api/bands', async function (req, res) {
  res.type('json');

  let response = await getBandsAsync()

  res.send(response);
});

/**
 * Gets a list of all the band availability postings
 */
app.get('/api/allBandAvailabilities', async function (req, res) {
  res.type('json');

  let allBandAvailabilities = [];
  let bands = await getBandsAsync();
  let availabilities;
  let bandAv = {};
  let time = {};

  for (let band of bands) {
    bandAv = {};
    availabilities = await getAvailabilitiesByBandAsync(band.bandName);
    bandAv['id'] = band.id;
    bandAv['name'] = band.bandName;
    bandAv['availableTimes'] = [];
    if (availabilities!=="No band") {
      for (let av of availabilities) {
        time = {};
        time['timeId'] = av.id;
        time['timeString'] = av.time;
        bandAv['availableTimes'].push(time);
      }
    }
    allBandAvailabilities.push(bandAv);
  }
  res.send(JSON.stringify(allBandAvailabilities));
});

/**
 * Adds a timeframe to the band's availability list
 */
app.post('/api/band/addAvailability', async function (req, res) {
  res.type('text');
  
  let band = req.body.bandName;
  let timeString = req.body.timeString;

  console.log(band);
  console.log(timeString);

  await createBandAvailabilityAsync(band, timeString);
  res.status(201).send('Added successfully');
});

/**
 * Returns all the availability listings for a given band
 */
app.get('/api/bandAvailability/:bandId', function (req, res) {
  res.type('json');

  let response = "";
  let bandId = req.params.bandId;

  switch(bandId) {
      case "1":
          response = {
            "availableTimes": [
              { "timeId": "101", "timeString": "2023-12-10 19:00" },
              { "timeId": "102", "timeString": "2023-12-12 20:00" },
              { "timeId": "103", "timeString": "2023-12-15 21:00" }
          ]
          };
          break;
      case "2":
          response = {
            "availableTimes": [
              { "timeId": "201", "timeString": "2023-12-11 18:00" },
              { "timeId": "202", "timeString": "2023-12-13 19:30" },
              { "timeId": "203", "timeString": "2023-12-16 20:00" }
          ]
          };
          break;
      default:
          res.status(400).send(`{"error": "Band with id ${bandId} not found"}`);
          return;
  }

  res.send(JSON.stringify(response));
});

/**
 * Gets all the reservations for a particular band
 */
app.get('/api/band_schedule/:bandId', async function (req, res) {
  res.type('json');

  let bandId = req.params.bandId;

  let reservations = await getReservationsByBandAsync(bandId);

  // Mock data representing reservations for a band
/*
  let reservations = [
      {
          "reservationId": "res1",
          "bandId": bandId,
          "venueName": "Venue A",
          "date": "2023-12-10",
          "startTime": "19:00",
          "endTime": "21:00"
      },
      {
          "reservationId": "res2",
          "bandId": bandId,
          "venueName": "Venue B",
          "date": "2023-12-12",
          "startTime": "20:00",
          "endTime": "22:00"
      }
  ];

  // Filter reservations by the bandId
  let filteredReservations = reservations.filter(reservation => reservation.bandId === bandId);
*/
  // Sending the filtered list of reservations as JSON response
  res.send(reservations);
});

/**
 * Reserves a particular band availability for a venue
 */
app.post('/api/reserve/:timeId', function (req, res) {
  let timeId = req.params.timeId;

  // Placeholder for your reservation logic
  console.log(`Received request to reserve time ID: ${timeId}`);

  // Sending a response back to the client
  res.json({ message: `Reservation request for time ID ${timeId} received` });
});

/**
 * Gets the full list of venues in the database
 */
app.get('/api/venues', function (req, res) {
  res.type('json');

  let response = 
  `
  [ {
      "id": "1",
      "name": "House of Hummus",
      "description": "Mediterranean eats and libations",
      "manager": "4"
    },
    {
      "id": "2",
      "name": "The Zax",
      "description": "Low key hangout spot with groovy vibes",
      "manager": "3"
    }
  ]
  `

  res.send(response);
});

/**
 * Gets all the info for a particular venue
 */
app.get('/api/venues/:venueId', function (req, res) {
  res.type('json');

  let response = "";
  let venueId = req.params.venueId;

  if (venueId=="1") {
      response = 
      `
      {
        "id": "1",
        "name": "House of Hummus",
        "description": "Mediterranean eats and libations",
        "manager": "4"
        }
      `;
  } else if ( venueId=="2") {
    response = 
    `
    {
      "id": "2",
      "name": "The Zax",
      "description": "Low key hangout spot with groovy vibes",
      "manager": "3"
    }
    `;
  } else {
    res.status(400).send(`{"error": "Venue with id ${venueId} not found" }`);
    return;
  }

  res.send(response);

});

/**
 * Gets all the reservations at a particular venue
 */
app.get('/api/venue_reservations/:venueId', function (req, res) {
  let venueId = req.params.venueId;

  // Mock data representing reservations for a venue
  let reservations = [
      {
          "reservationId": "r1",
          "venueId": venueId,
          "bandName": "Aodhan and the Programmers",
          "time": "2023-12-10 19:00"
      },
      {
          "reservationId": "r2",
          "venueId": venueId,
          "bandName": "The DOM Element Collective",
          "time": "2023-12-12 20:00"
      }
  ];

  // Filter reservations by the venueId
  let filteredReservations = reservations.filter(reservation => reservation.venueId === venueId);

  // Sending the filtered list of reservations as JSON response
  res.json(filteredReservations);
});

/**
 * Gets the full list of users from the database
 */
app.get('/api/users', function (req, res) {
  res.type('json');

  let response = 
  `
  [ 
    {
      "id": "1",
      "name": "Alice",
      "username": "alice",
      "type": "band",
      "managerOf": "2"
    },
    {
      "id": "2",
      "name": "Bronson",
      "username": "bronson",
      "type": "band",
      "managerOf": "1"
    },
    {
      "id": "3",
      "name": "Clarice",
      "username": "clarice",
      "type": "venue",
      "managerOf": "2"
    },
    {
      "id": "4",
      "name": "Davendra",
      "username": "davendra",
      "type": "venue",
      "managerOf": "1"
    }
  ]
  `

  res.send(response);
});

/**
 * Gets the detailed info for the user with a particular id
 */
app.get('/api/users/:userId', function (req, res) {
  res.type('json');

  let response = "";
  let userId = req.params.userId;

  if (userId=="1") {
      response = 
      `
      {
        "id": "1",
        "name": "Alice",
        "username": "alice",
        "type": "band",
        "managerOf": "2"
      }
      `;
  } else if ( userId=="2") {
    response = 
    `
    {
      "id": "2",
      "name": "Bronson",
      "username": "bronson",
      "type": "band",
      "managerOf": "1"
    }
    `;
  } else if ( userId=="3") {
    response = 
    `
    {
      "id": "3",
      "name": "Clarice",
      "username": "clarice",
      "type": "venue",
      "managerOf": "2"
    }
    `;
  } else if ( userId=="4") {
    response = 
    `
    {
      "id": "4",
      "name": "Davendra",
      "username": "davendra",
      "type": "venue",
      "managerOf": "1"
    }
    `;
  } else {
    res.status(400).send(`{"error": "User with id ${userId} not found" }`);
    return;
  }

  res.send(response);

});

/**
 * Gets the detailed info for the user with a particular username
 */
app.get('/api/userInfo/:userName', async function (req, res) {
  console.log('in api');
  let userName = req.params.userName;
  
  try{
    const response = await getUserInfoByUsernameAsync(userName);
    
    console.log(response);
    
    if(!response){
      res.status(400).send('no user found');
      return;
    }
    res.status(200).send(response);

  }
  catch(error){
    res.status(500).send(error);
  }
  
  /*
  let response;
  if (userName=="alice") {
      response = 
      `
      {
        "id": "1",
        "name": "Alice",
        "username": "alice",
        "type": "band",
        "managerOf": "2"
      }
      `;
  } else if ( userName=="bronson") {
    response = 
    `
    {
      "id": "2",
      "name": "Bronson",
      "username": "bronson",
      "type": "band",
      "managerOf": "1"
    }
    `;
  } else if ( userName=="clarice") {
    response = 
    `
    {
      "id": "3",
      "name": "Clarice",
      "username": "clarice",
      "type": "venue",
      "managerOf": "2"
    }
    `;
  } else if ( userName=="davendra") {
    response = 
    `
    {
      "id": "4",
      "name": "Davendra",
      "username": "davendra",
      "type": "venue",
      "managerOf": "1"
    }
    `;
  } else {
    res.status(400).send(`{"error": "User with name ${userName} not found" }`);
    return;
  }
  res.status(200).send(response);
  */
});

/**
 * Logs a user into the database
 */
app.post('/api/login', async function (req, res) {
  let user = req.body.username;
  let pw = req.body.password;
  try {
    const answer = await loginAsync(user, pw);
    res.status(answer.code).send(answer.value);
  }
  catch (error) {
    res.status(500).send(error);
  }
  
});

/**
 * Creates a new user account
 */
app.post('/api/users/newUser'), async function (req, res) {
  res.type('text');

  let userId;
  let user = req.body.username;
  let pw = req.body.password;
  let type = req.body.type;
  let entity = req.body.entityName;
  let entityDesc = req.body.entityDesc;

  if (!user||!pw||!type||!entity) {
    res.status(400).send("Missing required info!");
    return;
  }

  let result = await createAccountAsync(user, pw)
                      .then(statusCheck)
                      .then(resp => resp.json())
                      .catch(res.status(400).send);
  
  if (type==="band") {
    result = await createBandAsync(username, entity)
                    .then(statusCheck)
                    .then(resp => resp.json())
                    .catch(res.status(400).send);             
  } else if (type==="venue") {
    result = await createVenueAsync(username, entity)
                    .then(statusCheck)
                    .then(resp => resp.json())
                    .catch(res.status(400).send);             
  } else {
    res.status(400).send("Invalid entity type specified!");
  }

  res.status(200).send("User successfully created!");
}

/**
 * Creates a new account
 */
app.post('/api/createAccount', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let type = req.body.userType;
  let entityName = req.body.bandOrVenueName;

  if (!username || !password) {
    res.status(400).json({ message: "Username or password is missing" });
    return;
  }

  if (username === "failure") {
    res.status(400).json({ message: `Account creation failed for user ${username}` });
  } else {
    // Here, you would typically add logic to create an account
    // For now, we're just sending a success response
    await createAccountAsync(username, password, type, entityName);
    res.status(201).json({ message: `Account created successfully for user ${username}` });
  }
});

 /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
 async function statusCheck(res) {
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res;
}
