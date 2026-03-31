const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from src/public
app.use(express.static(path.join(__dirname, 'src/public')));

let appointments = [];

// Landing page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

// Appointment submission
app.post('/submit-appointment', (req, res) => {
    const { name, email, date, department } = req.body;
    appointments.push({ name, email, date, department });
    res.send(`<script>alert('Booked!'); window.location.href='/';</script>`);
});

// Admin Data
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

app.listen(PORT, () => {
    console.log(`🚀 Hospital Server live on port ${PORT}`);
});
