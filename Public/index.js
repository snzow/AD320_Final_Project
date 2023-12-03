
"use strict";

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('login.html')) {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        prefillUsername(); // Prefill the username if it's saved in localStorage
    } else {
        // Show the main page

// Show band availability section for band users
if (localStorage.getItem('userType') === 'band') {
    document.getElementById('band-availability').style.display = 'block';
} else {
    document.getElementById('band-availability').style.display = 'none';
    const reserveBandElement = document.getElementById('reserve-band'); // Replace with lement ID
    if (reserveBandElement) {
        reserveBandElement.addEventListener('click', checkLoginAndRedirect);
    }
}

        fetchBands();
    }
    
});

function fetchBands() {
    fetch('/api/bands')
        .then(response => response.json())
        .then(bands => {
            const bandsList = document.getElementById('bands-list');
            bands.forEach(band => {
                const bandDiv = document.createElement('div');
                bandDiv.innerHTML = `<h3>${band.name}</h3><p>${band.description}</p>`;
                bandDiv.addEventListener('click', () => showBandDetails(band.id));
                bandsList.appendChild(bandDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching bands:', error);
        });
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Test if the username and password match the specific credentials
    if (username === 'Alice' && password === '1234') {
        // Perform the login actions
        localStorage.setItem('username', username);
        const userType = document.getElementById('userType').value;
        localStorage.setItem('userType', userType);
        
        // Redirect to main page or show success message
        window.location.href = 'index.html'; // Redirect to the main page after login
    } else {
        // Handle login failure
        alert('Login failed. Please try again.');
    }
}

    /* 
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Saving username to localStorage
    localStorage.setItem('username', username);
    const userType = document.getElementById('userType').value;
    localStorage.setItem('userType', userType);

    // Replace with your API endpoint
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Handle successful login
            // Redirect to main page or show success message
            window.location.href = 'index.html'; // Redirect to the main page after login
        } else {
            // Handle login failure
            alert('Login failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred while attempting to log in.');
    });
*/

function prefillUsername() {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
    }
}

function checkLoginAndRedirect(event) {
    event.preventDefault(); // Prevent default action if it's a link

    // Check if user is logged in
    if (localStorage.getItem('username')) {
        window.location.href = 'reserve.html'; // Redirect to reservation page
    } else {
        window.location.href = 'login.html'; // Redirect to login page
    }
}

function showReservationForm() {
    // Logic to show reservation form after successful login
    const reservationSection = document.getElementById('reserve');
    if (localStorage.getItem('userType') === 'venue') {
    reservationSection.style.display = 'block';
} else {
    reservationSection.style.display = 'none';
}
    // Populate reservation form fields as necessary
}

function showBandDetails(bandId) {
    fetch(`/api/bands/${bandId}`)
        .then(response => response.json())
        .then(bandDetails => {
            // Display band details in a specific section or modal
        })
        .catch(error => {
            console.error('Error fetching band details:', error);
        });
}

document.getElementById('reservation-form').addEventListener('submit', handleReservation);

function handleReservation(event) {
    event.preventDefault();
    
    const time = document.getElementById('time').value;
    const venueId = document.getElementById('venueId').value;
    const bandId = document.getElementById('bandId').value;
    
    // Constructing the reservation data object
    const reservationData = {
        time: time,
        venueId: parseInt(venueId, 10),  // Convert to integer as your database expects an INTEGER
        bandId: parseInt(bandId, 10)     // Convert to integer
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
