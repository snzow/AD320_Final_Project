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

    function updateDisplayBasedOnUserType() {
        const userType = localStorage.getItem('userType');
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

        // Test if the username and password match the specific credentials. alice for band, clarice for venu
        if ((username === 'alice' && password === '1234')|| (username === 'clarice' && password === '1234')) {
            // Perform the login actions
            localStorage.setItem('username', username);
            var url = API_ROOT + '/api/userInfo/' + username
            
            fetch(url)
            .then(response => response.json())
            .then(userInfo => {
                localStorage.setItem('userType', userInfo.type);
            })
            .catch(error => {
                console.error('Error fetching userInfo:', error);
            });
            
            // Redirect to main page or show success message
            window.location.href = 'index.html'; // Redirect to the main page after login
        } else {
            // Handle login failure
            alert('Login failed. Please try again.');
        }
    }

    function prefillUsername() {
        const savedUsername = localStorage.getItem('username');
        const usernameInput = document.getElementById('username');

        if (savedUsername && usernameInput) {
            usernameInput.value = savedUsername;
        }
    }

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
