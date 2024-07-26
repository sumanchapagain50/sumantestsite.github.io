document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <input type="text" id="name" placeholder="Your Name">
        <input type="datetime-local" id="available-from">
        <input type="datetime-local" id="available-to">
        <button id="submit">Submit</button>
        <div id="timeslots"></div>
    `;
    
    document.getElementById('submit').addEventListener('click', submitAvailability);
});

function submitAvailability() {
    const name = document.getElementById('name').value;
    const availableFrom = document.getElementById('available-from').value;
    const availableTo = document.getElementById('available-to').value;

    if (name && availableFrom && availableTo) {
        const availability = {
            name,
            availableFrom,
            availableTo,
        };

        // Save to localStorage (or send to server)
        let availabilities = JSON.parse(localStorage.getItem('availabilities')) || [];
        availabilities.push(availability);
        localStorage.setItem('availabilities', JSON.stringify(availabilities));

        displayAvailabilities();
    }
}

function displayAvailabilities() {
    const timeslotsDiv = document.getElementById('timeslots');
    const availabilities = JSON.parse(localStorage.getItem('availabilities')) || [];
    
    let output = '<h3>Availabilities</h3>';
    availabilities.forEach(a => {
        output += `
            <div>
                <strong>${a.name}</strong><br>
                From: ${new Date(a.availableFrom).toLocaleString()}<br>
                To: ${new Date(a.availableTo).toLocaleString()}
            </div>
            <hr>
        `;
    });
    timeslotsDiv.innerHTML = output;
}
