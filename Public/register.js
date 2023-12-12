/**
 * Name: Team Crimson Kings
 * Date: December 9, 2023
 * This register.js file implements the guest interface for a band reservation project.
 * It allows a guess to register an account and become a user.
 **/

/**
 * Handles the user registration process.
 * This function is triggered when the registration form is submitted.
 * It validates the user input, sends a POST request to the server to create an account,
 * and handles the server response.
 *
 * @param {Event} event - The event object associated with the form submission.
 */
function handleRegistration(event) {
    event.preventDefault();

    const API_ROOT = "http://localhost:3001";
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const userType = document.getElementById('userType').value;
    const bandOrVenueName = document.getElementById('bandOrVenueName').value;
    const formMessage = document.getElementById('form-message');

    // Regular expression to validate band/venue name
    const validNamePattern = /^[a-zA-Z0-9\s]+$/;
    if (!validNamePattern.test(bandOrVenueName) || !validNamePattern.test(username)) {
        console.log('Error: Name should not contain special characters.');
        formMessage.textContent = 'Error: Name should not contain special characters.';
        return;
    }

    // Handle registration
    fetch(API_ROOT + '/api/createAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            userType,
            bandOrVenueName
        }),
    })
    .then(response => {
        if (!response.ok) {
            // If response is not ok, throw an error
            throw new Error(data.message);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        formMessage.textContent = 'Account created successfully. Please login.';
    })
    .catch(error => {
        console.error('Error during registration:', error);
        formMessage.textContent = 'Registration error. Please try again.';
    });
}

// Add event listener to the registration form
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
});