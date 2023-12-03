const express = require('express');
const { loginAsync } = require('./Server/backendManager');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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