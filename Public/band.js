(async function () {
    const API_ROOT = "http://localhost:3001";
    let bookingSchedule = [];

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
                    const bandId = user.managerOf;
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
    
    async function fetchBandSchedule(bandId) {
        try {
            const response = await fetch(`${API_ROOT}/api/band_schedule/${bandId}`);
            const scheduleData = await response.json();
            loadBookingSchedule(scheduleData);
        } catch (error) {
            console.error('Error fetching band schedule:', error);
        }
    }

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