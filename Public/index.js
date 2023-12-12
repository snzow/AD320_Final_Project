/**
 * Name: Team Crimson Kings
 * Date: December 9, 2023
 * This JavaScript file implements the user interface for a band reservation project.
 * It allows a venue to reserve a band based on the date and time that they choose.
 **/

"use strict";

import { userInfo } from "os";
(function () {

    const API_ROOT = "http://localhost:3001";


    window.addEventListener("load", init);

    /**
     * Initializes the application. Sets up event listeners and pre-fills username if available.
     */
    function init() {
        prefillUsername();
        fetchUserTypeAndDisplay();

        const loginLogoutButton = document.getElementById('login-logout-button');
        if (loginLogoutButton) {
            loginLogoutButton.addEventListener('click', handleLoginLogout);
        }
        
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    };

    /**
     * Updates the display based on the user type (band or venue).
     * Shows or hides specific sections of the page accordingly.
     */
    function updateDisplayBasedOnUserType() {
        const userType = localStorage.getItem('userType');
        const userName = localStorage.getItem('username');
        const loginLogoutButton = document.getElementById('login-logout-button');

        const scheduleSection = document.getElementById('schedule');
        const availableTimeSection = document.getElementById('availableTime-section');
        const availableBandSection = document.getElementById('availableBand');
        const reserveListSection = document.getElementById('reserveList');

        if (userType === 'band' || userType === 'venue') {
            if (loginLogoutButton) {
                loginLogoutButton.textContent = 'Log Out';
            }
        } else {
            if (loginLogoutButton) {
                loginLogoutButton.textContent = 'Log In';
            }
        }

        console.log(userType);

        if (userType === 'band') {
            if (scheduleSection) scheduleSection.style.display = 'block';
            if (availableTimeSection) availableTimeSection.style.display = 'block';
            if (availableBandSection) availableBandSection.style.display = 'none';
            if (reserveListSection) reserveListSection.style.display = 'none';
        } else if (userType === 'venue') {
            if (scheduleSection) scheduleSection.style.display = 'none';
            if (availableTimeSection) availableTimeSection.style.display = 'none';
            if (availableBandSection) availableBandSection.style.display = 'block';
            if (reserveListSection) reserveListSection.style.display = 'block';
        } else {
            // Hide both sections for guests or undefined user types
            if (scheduleSection) scheduleSection.style.display = 'none';
            if (availableTimeSection) availableTimeSection.style.display = 'none';
            if (availableBandSection) availableBandSection.style.display = 'none';
            if (reserveListSection) reserveListSection.style.display = 'none';
        }
    }

    /**
     * Fetches the user type from the server and updates the display.
     * If the user is already stored in localStorage, it uses that information.
     */
    function fetchUserTypeAndDisplay() {
        const username = localStorage.getItem('username');
        if (username) {
            fetch(API_ROOT + `/api/userInfo/${username}`)
                .then(response => response.json())
                .then(user => {
                    if (user && user.type) {
                        localStorage.setItem('userType', user.type);
                        updateDisplayBasedOnUserType();
                    }
                })
                .catch(error => {
                    console.error('Error fetching user type:', error);
                });
        } else {
            updateDisplayBasedOnUserType();
        }
    }

    /**
     * Handles the login and logout actions.
     * Clears local storage and updates display on logout, redirects to login page if not logged in.
     * @param {Event} event - The event logout.
     */
    function handleLoginLogout(event) {
        event.preventDefault();
        const userType = localStorage.getItem('userType');
        
        if (userType === 'band' || userType === 'venue') {
            // User is logged in, so log them out
            localStorage.clear();
            updateDisplayBasedOnUserType(); // Update display after logout

        } else {
            // User is not logged in, redirect to the login page
            window.location.href = 'login.html';
        }
    }

    /**
    * Handles the login process. Checks credentials and updates local storage and UI upon success.
    * @param {Event} event - The event login
    */
    async function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let body = {"username" : username, "password" : password};

        const loginResult = await fetch(API_ROOT + '/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        })
        .then(response => {
            if (!response.ok) {
                // If response is not ok, throw an error
                throw new Error(response.message);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Login error:', error);
        });

        localStorage.setItem("username", loginResult.username);
        localStorage.setItem("userType", loginResult.type);
    
        // Test if the username and password match the specific credentials. alice for band, clarice for venu
            window.location.href = 'index.html'; // Redirect to the main page after login
    }


    /**
     * Pre-fills the username field if a username is stored in local storage.
     */
    function prefillUsername() {
        const savedUsername = localStorage.getItem('username');
        const usernameInput = document.getElementById('username');

        if (savedUsername && usernameInput) {
            usernameInput.value = savedUsername;
        }
    }

    /**
     * Fetches and displays the details of a specific band.
     * @param {string} bandId - The unique identifier of the band.
     */
    function showBandDetails(bandId) {
        fetch(API_ROOT + `/api/bands/${bandId}`)
            .then(response => response.json())
            .then(bandDetails => {
                // Display band details in a specific section or modal
            })
            .catch(error => {
                console.error('Error fetching band details:', error);
            });
    }
})();
