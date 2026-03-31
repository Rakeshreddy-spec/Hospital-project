const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This tells the server to look in /src/public for your website files
app.use(express.static(path.join(__dirname, 'src', 'public')));

let appointments = [];

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

// Route for appointment booking
app.post('/submit-appointment', (req, res) => {
    const { name, email, date, department } = req.body;
    appointments.push({ name, email, date, department });
    res.send(`<script>alert('Appointment Booked!'); window.location.href='/';</script>`);
});

// Route for the Admin Dashboard to get data
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

app.listen(PORT, () => {
    console.log(`Hospital Server is LIVE on port ${PORT}`);
});
