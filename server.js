const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from src/public
app.use(express.static(path.join(__dirname, 'src/public')));

// In-memory Database
let appointments = [
    { name: "Sample Patient", email: "patient@example.com", date: "2026-04-10", department: "Cardiology" }
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

// Handle Appointment Submission
app.post('/submit-appointment', (req, res) => {
    const { name, email, date, department } = req.body;
    appointments.push({ name, email, date, department });

    res.send(`
        <script>
            alert('Appointment Booked Successfully!');
            window.location.href = '/index.html';
        </script>
    `);
});

// Admin API to fetch appointments
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// Admin Login
app.post('/login', (req, res) => {
    res.redirect('/admin.html');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});