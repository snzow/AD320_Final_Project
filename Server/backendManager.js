

/**
 *  takes a reservation object containing a venueName, bandName, and Datetime. Attempts to create a reservation in the database.
 *  If successful will return a code of 201 and the created object. Otherwise will return 400 and the reason why
 * 
 * @param {Reservation} reservation should follow the format 
 * { 
 *  bandName,
    venueName,
    dateTime,
 * }
 * @returns the http code to send and the value of the db result
 */
async function makeReservationAsync(reservation) {
  const result = await makeReservationDb(reservation);
  if (result == 'No Venue' || result == 'Time Unavailable') {
    return {
      code: 400,
      value: result,
    };
  }
  return {
    code: 201,
    value: result,
  };
}

/**
 * takes the venuename for a venu and returns all current reservations at that venue
 * @param {string} venue the name of the venue to return reservations for
 * @returns either 'No Venue' if the venue does not exist, or a list of reservations at that venue
 */
async function getReservationsByVenueAsync(venue) {
  const result = await getReservationsByVenue(venue);
  if (result == 'No Venue') {
    return 'No Venue';
  } else {
    return result;
  }
}

/**
 * takes the bandname for a band and returns all current reservations for that band
 * @param {string} band the name of the band to return reservations for
 * @returns either 'No Band' if the band does not exist, or a list of reservations for that band
 */
async function getReservationsByBandAsync(band) {
  const result = await getReservationsByBand(band);
  if (result == 'No Band') {
    return 'No Band';
  } else {
    return result;
  }
}

/**
 * returns all currently scheduled reservations
 * @returns all reservations
 */
async function getReservationsAsync() {
  return await getReservations();
}

/**
 * attempts to create a user . returns a 400 code and the reason for failure if it fails, and 201 and the user info if it succeeds
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
async function createAccountAsync(username, password) {
  const result = await createUser(username, password);
  if (result == 'Username Taken') {
    return {
      code: 400,
      value: result,
    };
  }
  return {
    code: 201,
    value: result,
  };
}

/**
 * attempts to log a user in. returns a 400 code and the reason for failure if it fails, and 200 and the user info if it succeeds
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
async function loginAsync(username, password) {
  const result = await login(username, password);

  if (result == 'Invalid Username' || result == 'Invalid Password') {
    return {
      code: 400,
      value: result,
    };
  }
  return {
    code: 200,
    value: result,
  };
}