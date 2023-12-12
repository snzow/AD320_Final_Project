/**
 * Name: Team Crimson Kings
 * Date: December 9, 2023
 * This venue.js file implements the venue interface for a band reservation project.
 * It allows a venue to reserve a band and see their current reservations.
 **/

(function () {

    const API_ROOT = "http://localhost:3001";

    /**
     * Initializes the application on DOMContentLoaded.
     * Fetches available bands and current venue reservations.
     */
    document.addEventListener('DOMContentLoaded', () => {
        // Fetch bands and their available time slots
        fetchAvailableBands();
        // Fetch venue reservations when the page loads
        fetchVenueReservations();
    });

    document.getElementById('bands-display').addEventListener('click', function(event) {
        if (event.target && event.target.nodeName === 'BUTTON') {
            if (event.target.classList.contains('details-btn')) {
                const detailsId = event.target.getAttribute('data-details-id');
                toggleDetails(detailsId);
            } else if (event.target.hasAttribute('data-time-id')) {
                const timeId = event.target.getAttribute('data-time-id');
                const bandId = event.target.getAttribute('data-band-id');
                handleReservation(timeId, bandId);
            }
        }
    });

    /**
     * Fetches the venue ID associated with the current user.
     * @returns {Promise<string>} A promise that resolves with the venue ID.
     */
    function fetchUserVenueId() {
        const username = localStorage.getItem('username');
        if (username) {
            return fetch(`${API_ROOT}/api/userInfo/${username}`)
                .then(response => response.json())
                .then(user => {
                    const venueId = user.managerOf;
                    return venueId; 
                })
                .catch(error => {
                    console.error('Error fetching venueId:', error);
                });
        } else {
            return Promise.reject('No username found in localStorage');
        }
    }

    /**
     * Fetches and displays the current reservations for the venue.
     */
    async function fetchVenueReservations() {
        try {
            const venueId = await fetchUserVenueId();
            if (!venueId) {
                console.error('No venue ID found for the logged-in user.');
                return; // Exit the function if no venue ID is found
            }
    
            const response = await fetch(`${API_ROOT}/api/venue_reservations/${venueId}`);
            const reservations = await response.json();
    
            const reservationsList = document.getElementById('reservations-display');
            reservationsList.innerHTML = ''; // Clear any existing reservation entries
    
            reservations.forEach(reservation => {
                const reservationEntry = document.createElement('div');
                reservationEntry.classList.add('reservation-entry');
                reservationEntry.innerHTML = `
                    <p>Date: ${reservation.date}</p>
                    <p>Start Time: ${reservation.startTime}</p>
                    <p>End Time: ${reservation.endTime}</p>
                    <p>Band: ${reservation.bandName}</p>
                `;
                reservationsList.appendChild(reservationEntry);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Handles the submission of the reservation form.
     */
    function handleReservation(timeId, bandId) {
        // Constructing the reservation data object
        const reservationData = {
            bandId: bandId,
            timeId: timeId
        };
        // API call to reserve a band
        fetch('/api/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle successful reservation
                alert(`Reservation confirmed! Confirmation ID: ${data.reservationId}`);
                // Optionally, clear the form or redirect the user
            } else {
                // Handle reservation failure
                alert('Reservation failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error making reservation:', error);
            alert('An error occurred while making the reservation.');
        });
    }

    /**
     * Fetches and displays the list of available bands.
     */
    function fetchAvailableBands() {
        fetch('http://localhost:3001/api/allBandAvailabilities')
            .then(response => response.json())
            .then(bands => {
                displayAvailableBands(bands);
            })
            .catch(error => {
                console.error('Error fetching available bands:', error);
            });
    }
    
    function toggleDetails(detailsId) {
        const details = document.getElementById(detailsId);
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }

    /**
     * Displays the available bands in the UI.
     * @param {Array} bands - Array of band objects with their availability.
     */
    function displayAvailableBands(bands) {
        let bandsList = '<ul>';
        for (let band of bands) {
            bandsList += `
                <li>
                    ${band.name}
                    <button class="details-btn" data-details-id="details-${band.id}">View Details</button>
                    <div id="details-${band.id}" class="band-details" style="display:none;">
                        Available Times: <ul>`;
            for (let time of band.availableTimes) {
                bandsList += `
                        <li>
                            ${time.timeString} 
                            <button data-time-id="${time.timeId}" data-band-id="${band.id}">Reserve</button>
                        </li>`;
            }
            bandsList += `</ul>
                    </div>
                </li>`;
        }
        bandsList += '</ul>';
        document.getElementById('bands-display').innerHTML = bandsList;
    }

})();