/**
 * Name: Team Crimson Kings
 * Date: December 9, 2023
 * This band.js file implements the band interface for a band reservation project.
 * It allows a band to add available time and to see their booked sschedule.
 **/

/**
 * Self-invoking function to manage band booking operations.
 * This script manages the functionality related to fetching and displaying
 * band schedules and handling band booking updates.
 */
(async function () {
    const API_ROOT = "http://localhost:3001";
    let bookingSchedule = [];

    /**
     * Event listener for DOMContentLoaded.
     * Fetches the user's band ID, fetches band schedule, and sets up event listeners
     * for band booking updates upon loading the DOM.
     */
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const bandId = await fetchUserBandId(); 
            if (!bandId) {
                throw new Error('Band ID not found');
            }
            await fetchBandSchedule(bandId);
            
            // Add event listener to the band booking form
            const availableTimeForm = document.getElementById('availableTime-form');
            if (availableTimeForm) {
                availableTimeForm.addEventListener('submit', availableTimeUpdate);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    /**
     * Fetches the band ID associated with the current user.
     * Retrieves the user's band ID from the server based on their username.
     *
     * @returns {Promise<string|Error>} A promise that resolves with the band ID or rejects with an error.
     */
    function fetchUserBandId() {
        const username = localStorage.getItem('username');
        if (username) {
            return fetch(`${API_ROOT}/api/userInfo/${username}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(user => {
                    const bandId = user.band.id;
                    return bandId; 
                })
                .catch(error => {
                    console.error('Error fetching bandId:', error);
                    throw error; // Rethrow the error to be caught in the outer try-catch
                });
        } else {
            return Promise.reject('No username found in localStorage');
        }
    }
    
    /**
     * Fetches the schedule for a specific band.
     * Sends a request to the server to retrieve the booking schedule of a band based on its ID.
     *
     * @param {string} bandId - The unique identifier of the band.
     */
    async function fetchBandSchedule(bandId) {
        try {
            const response = await fetch(`${API_ROOT}/api/band_schedule/${bandId}`);
            const scheduleData = await response.json();
            loadBookingSchedule(scheduleData);
        } catch (error) {
            console.error('Error fetching band schedule:', error);
        }
    }

    /**
     * Loads and displays the booking schedule.
     * Clears existing schedule entries and renders new ones based on the provided schedule data.
     *
     * @param {Array} scheduleData - Array of booking data for the band.
     */
    function loadBookingSchedule(scheduleData) {
        const bookingScheduleContainer = document.getElementById('schedule-display');
        
        // Clear existing schedule entries
        bookingScheduleContainer.innerHTML = '';

        // Loop through booking data and create schedule entries
        scheduleData.forEach(booking => {
            const scheduleEntry = document.createElement('div');
            scheduleEntry.classList.add('booking-entry');
            scheduleEntry.innerHTML = `
                <p>Date: ${booking.date}</p>
                <p>Start Time: ${booking.startTime}</p>
                <p>End Time: ${booking.endTime}</p>
                <p>Venue: ${booking.venueName}</p>
            `;
            
            bookingScheduleContainer.appendChild(scheduleEntry);
        });
    }

    /**
     * Handles the submission of the band booking update form.
     * Updates the band's booking schedule with new booking details.
     *
     * @param {Event} event - The event object associated with the form submission.
     */
    function availableTimeUpdate(event) {
        event.preventDefault();
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('start-time').value;
        const venue = document.getElementById('venue').value;

        // Add the new booking to the bookingSchedule array
        bookingSchedule.push(newBooking);

        // Reload the updated schedule
        loadBookingSchedule(bookingSchedule);
        
        // Clear the form fields
        document.getElementById('date').value = '';
        document.getElementById('start-time').value = '';
        document.getElementById('end-time').value = '';
        document.getElementById('venue').value = '';
    }

})();