"use strict";

document.addEventListener('DOMContentLoaded', () => {
    prefillUsername();
    updateDisplayBasedOnUserType();

    const loginLogoutButton = document.getElementById('login-logout-button');
    if (loginLogoutButton) {
        loginLogoutButton.addEventListener('click', handleLoginLogout);
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
});

function updateDisplayBasedOnUserType() {
    const userType = localStorage.getItem('userType');
    const loginLogoutButton = document.getElementById('login-logout-button');

    const scheduleSection = document.getElementById('schedule');
    const reserveSection = document.getElementById('reserve');
    const availableBandSection = document.getElementById('availableBand');

    if (userType === 'band' || userType === 'venue') {
        if (loginLogoutButton) {
            loginLogoutButton.textContent = 'Log Out';
        }
    } else {
        if (loginLogoutButton) {
            loginLogoutButton.textContent = 'Log In';
        }
    }

    if (userType === 'band') {
        if (scheduleSection) scheduleSection.style.display = 'block';
        if (reserveSection) reserveSection.style.display = 'none';
        if (availableBandSection) availableBandSection.style.display = 'none';
    } else if (userType === 'venue') {
        if (scheduleSection) scheduleSection.style.display = 'none';
        if (reserveSection) reserveSection.style.display = 'block';
        if (availableBandSection) availableBandSection.style.display = 'block';
    } else {
        // Hide both sections for guests or undefined user types
        if (scheduleSection) scheduleSection.style.display = 'none';
        if (reserveSection) reserveSection.style.display = 'none';
        if (availableBandSection) availableBandSection.style.display = 'none';
    }
}


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

function handleLoginLogout(event) {
    event.preventDefault();
    const userType = localStorage.getItem('userType');
    
    if (userType === 'band' || userType === 'venue') {
        // User is logged in, so log them out
        localStorage.removeItem('userType');
        updateDisplayBasedOnUserType(); // Update display after logout

    } else {
        // User is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
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
    const usernameInput = document.getElementById('username');

    if (savedUsername && usernameInput) {
        usernameInput.value = savedUsername;
    }
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
