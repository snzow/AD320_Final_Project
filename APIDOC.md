1. **Default Endpoint**
   - *Method:* `GET`
   - *URL:* `/`
   - *Description:* Returns a simple "Hello from the backend!" message.

2. **List of Bands**
   - *Method:* `GET`
   - *URL:* `/api/bands`
   - *Description:* Returns a list of all bands in the database.

3. **List of All Band Availabilities**
   - *Method:* `GET`
   - *URL:* `/api/allBandAvailabilities`
   - *Description:* Returns a list of all band availabilities.

4. **Add Band Availability**
   - *Method:* `POST`
   - *URL:* `/api/band/addAvailability`
   - *Description:* Adds a timeframe to the band's availability list.

5. **Band Availability by Band ID**
   - *Method:* `GET`
   - *URL:* `/api/bandAvailability/:bandId`
   - *Description:* Returns all the availability listings for a given band.

6. **Band Schedule by Band ID**
   - *Method:* `GET`
   - *URL:* `/api/band_schedule/:bandId`
   - *Description:* Gets all the reservations for a particular band.

7. **Reserve Band Availability**
   - *Method:* `POST`
   - *URL:* `/api/reserve/:timeId`
   - *Description:* Reserves a particular band availability for a venue.

8. **List of Venues**
   - *Method:* `GET`
   - *URL:* `/api/venues`
   - *Description:* Gets the full list of venues in the database.

9. **Venue Details by Venue ID**
   - *Method:* `GET`
   - *URL:* `/api/venues/:venueId`
   - *Description:* Gets all the info for a particular venue.

10. **Venue Reservations by Venue ID**
    - *Method:* `GET`
    - *URL:* `/api/venue_reservations/:venueId`
    - *Description:* Gets all the reservations at a particular venue.

11. **List of Users**
    - *Method:* `GET`
    - *URL:* `/api/users`
    - *Description:* Gets the full list of users from the database.

12. **User Details by User ID**
    - *Method:* `GET`
    - *URL:* `/api/users/:userId`
    - *Description:* Gets the detailed info for the user with a particular ID.

13. **User Details by Username**
    - *Method:* `GET`
    - *URL:* `/api/userInfo/:userName`
    - *Description:* Gets the detailed info for the user with a particular username.

14. **User Login**
    - *Method:* `POST`
    - *URL:* `/api/login`
    - *Description:* Logs a user into the database.

15. **Create New User Account**
    - *Method:* `POST`
    - *URL:* `/api/users/newUser`
    - *Description:* Creates a new user account.

16. **Create New Account (General)**
    - *Method:* `POST`
    - *URL:* `/api/createAccount`
    - *Description:* Creates a new account.
