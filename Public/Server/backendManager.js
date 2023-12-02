import {makeReservationDb,getReservationsByVenue, getReservations} from './dbManager'


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
export async function makeReservationAsync(reservation){
    const result = await makeReservationDb(reservation);
    if(result == 'No Venue' || result == 'Time Unavailable'){
        return {
            code : 400,
            value : result,
        }
    }
    return {
        code : 201,
        value : result
    }
}

export async function getReservationsByVenueAsync(venue){
    const result = await getReservationsByVenue(venue);
    if(result == 'No Venue'){
        return 'No Venue'
    }
    else{
        return result;
    }
}

export async function getReservationsAsync(){
    return await getReservations();
}