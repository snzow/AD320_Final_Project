import {getUserInfoByUsernameAsync, loginAsync} from "./Server/backendManager.js"
import express from 'express';
import cors from 'cors';
import { login } from "./Server/dbManager.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/api/bands', function (req, res) {
  res.type('json');

  let response = 
  `
  [ {
      "id": "1",
      "name": "Aodhan and the Programmers",
      "description": "Nerdcore house beats",
      "manager": "2"
    },
    {
      "id": "2",
      "name": "The DOM Element Collective",
      "description": "Lo-fi EDM chillwave",
      "manager": "1"
    }
  ]
  `

  res.send(response);
});

app.get('/api/bands/:bandId', function (req, res) {
  res.type('json');

  let response = "";
  let bandId = req.params.bandId;

  if (bandId=="1") {
      response = 
      `
      {
        "id": "1",
        "name": "Aodhan and the Programmers",
        "description": "Nerdcore house beats",
        "manager": "2"
      }
      `;
  } else if ( bandId=="2") {
    response = 
    `
    {
      "id": "2",
      "name": "The DOM Element Collective",
      "description": "Lo-fi EDM chillwave",
      "manager": "1"
    }
    `;
  } else {
    res.status(400).send(`{"error": "Band with id ${bandId} not found" }`);
    return;
  }

  res.send(response);

});

app.get('/api/allBandAvailabilities', function (req, res) {
  res.type('json');

  let allBandAvailabilities = [
    {
        "id": "1",
        "name": "Aodhan and the Programmers",
        "description": "Nerdcore house beats",
        "availableTimes": [
          { "timeId": "101", "timeString": "2023-12-10 19:00" },
          { "timeId": "102", "timeString": "2023-12-12 20:00" },
          { "timeId": "103", "timeString": "2023-12-15 21:00" }
      ]
    },
    {
        "id": "2",
        "name": "The DOM Element Collective",
        "description": "Lo-fi EDM chillwave",
        "availableTimes": [
          { "timeId": "201", "timeString": "2023-12-11 18:00" },
          { "timeId": "202", "timeString": "2023-12-13 19:30" },
          { "timeId": "203", "timeString": "2023-12-16 20:00" }
      ]
    },
];

  res.send(JSON.stringify(allBandAvailabilities));
});

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

app.get('/api/band_schedule/:bandId', function (req, res) {
  let bandId = req.params.bandId;

  // Mock data representing reservations for a band
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

  // Sending the filtered list of reservations as JSON response
  res.json(filteredReservations);
});

app.post('/api/reserve/:timeId', function (req, res) {
  let timeId = req.params.timeId;

  // Placeholder for your reservation logic
  console.log(`Received request to reserve time ID: ${timeId}`);

  // Sending a response back to the client
  res.json({ message: `Reservation request for time ID ${timeId} received` });
});


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

app.get('/login', async function (req, res) {
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

// POST endpoint for account creation
app.post('/api/createAccount', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username or password is missing" });
    return;
  }

  if (username === "failure") {
    res.status(400).json({ message: `Account creation failed for user ${username}` });
  } else {
    // Here, you would typically add logic to create an account
    // For now, we're just sending a success response
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
