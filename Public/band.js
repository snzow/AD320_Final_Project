document.addEventListener('DOMContentLoaded', () => {
    // Load booking schedule data and generate the schedule
    loadBookingSchedule();
});

function loadBookingSchedule() {
    // Simulated booking schedule data (replace with your data source)
    const bookingSchedule = [
        { date: '2023-12-10', venue: 'Venue A' },
        { date: '2023-12-15', venue: 'Venue B' },
        // Add more booking entries as needed
    ];

    const bookingScheduleContainer = document.getElementById('booking-schedule');

    // Loop through booking data and create schedule entries
    bookingSchedule.forEach(booking => {
        const scheduleEntry = document.createElement('div');
        scheduleEntry.classList.add('booking-entry');
        scheduleEntry.innerHTML = `<p>Date: ${booking.date}</p><p>Band: ${booking.band}</p>`;
        bookingScheduleContainer.appendChild(scheduleEntry);
    });
}
