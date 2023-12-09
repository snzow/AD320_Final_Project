const express = require('express');
//const { loginAsync } = require('./Server/backendManager');
const cors = require('cors');
const app = express();
const port = 3001;

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

app.get('/login/:username/:password', async function (req, res) {
  let user = req.params.username;
  let pw = req.params.password;

  let result = await loginAsync(user, pw)
                      .then(statusCheck)
                      .then(resp => resp.json())
                      .catch(res.status(400).send('Error while logging in'));
  
  if (result.code!==undefined) {
    res.type('json');
    res.send(result);
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